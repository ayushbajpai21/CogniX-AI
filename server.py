import os
import re
import json
import uuid
import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from agents import build_search_agent, build_reader_agent, writer_chain, critic_chain
from tools import scrape_url, web_search

load_dotenv()

app = FastAPI(title="CogniX AI API", version="2.0.0")

DOC_STORE = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str
    file_context: Optional[str] = ""
    mode: Optional[str] = "deep"


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "provider": "Groq LPU" if os.getenv("GROQ_API_KEY") else "OpenAI",
        "model": os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        "version": "2.0.0"
    }


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_file"
    content = await file.read()
    extracted_text = ""
    pages_count = 1

    if filename.lower().endswith(".pdf"):
        import io
        from pypdf import PdfReader
        try:
            reader = PdfReader(io.BytesIO(content))
            pages = []
            for p in reader.pages:
                t = p.extract_text()
                if t:
                    pages.append(t)
            extracted_text = "\n\n".join(pages)
            pages_count = len(reader.pages)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")
    else:
        try:
            extracted_text = content.decode("utf-8", errors="ignore")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read text file: {str(e)}")

    if not extracted_text.strip():
        extracted_text = f"Document {filename} uploaded successfully."

    # Detect document type and tailor suggested prompts
    lowered = (filename + " " + extracted_text).lower()
    if any(k in lowered for k in ["resume", "curriculum vitae", "cv", "education", "experience", "work experience", "skills", "projects", "employment", "certifications"]):
        doc_type = "resume"
        suggested_prompts = [
            "Comprehensive Resume Audit & ATS Gap Analysis",
            "2026 Live Market Role Match & Salary Benchmarks",
            "Skill Gap Breakdown & 30-Day Upskilling Plan",
            "STAR Impact Bullet Point Rewrites & Optimization"
        ]
    elif any(k in lowered for k in ["notes", "lecture", "chapter", "syllabus", "summary", "tutorial", "revision"]):
        doc_type = "notes"
        suggested_prompts = [
            "Deep Synthesis & Core Concept Breakdown",
            "Generate Comprehensive Q&A & Interview Prep",
            "Cross-Reference Notes with 2026 Industry State"
        ]
    else:
        doc_type = "document"
        suggested_prompts = [
            "Executive Summary & Strategic Analysis",
            "Fact-check & Critical Assessment",
            "Key Insights & Actionable Next Steps"
        ]

    # Trim to 4500 chars to maintain token budget while preserving full resume
    trimmed = extracted_text[:4500]
    doc_id = str(uuid.uuid4())[:8]
    DOC_STORE[doc_id] = trimmed

    return {
        "doc_id": doc_id,
        "filename": filename,
        "text": trimmed,
        "char_count": len(trimmed),
        "doc_type": doc_type,
        "pages_count": pages_count,
        "suggested_prompts": suggested_prompts
    }


def extract_urls(text: str):
    """Extract valid HTTP/HTTPS URLs from text."""
    urls = re.findall(r'https?://[^\s)\]"\'>]+', text)
    # Filter out common punctuation at end
    clean = []
    for u in urls:
        u = u.rstrip(".,;:)")
        if u not in clean and len(u) > 10:
            clean.append(u)
    return clean


@app.post("/api/research")
def run_research(req: ResearchRequest):
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    state = {}

    # Step 1: Scout Agent (Fast Direct Search)
    search_query = f"{topic} 2026"
    if req.file_context and any(k in req.file_context.lower() for k in ["resume", "cv", "experience", "education", "skills", "projects", "engineer", "developer"]):
        search_query = f"2026 industry hiring requirements skills salary benchmarks {topic}"
    try:
        state["search_results"] = web_search.invoke({"query": search_query})
    except Exception as e:
        state["search_results"] = f"Web search summary for {topic}."

    # Step 2: Scholar Agent (Fast DOM Scraping)
    found_urls = extract_urls(state["search_results"])
    target_url = found_urls[0] if found_urls else ""

    if target_url:
        try:
            scraped = scrape_url.invoke({"url": target_url})
            state["scraped_content"] = f"Source URL: {target_url}\n\nContent:\n{scraped[:3000]}"
        except Exception:
            state["scraped_content"] = state["search_results"][:1500]
    else:
        state["scraped_content"] = state["search_results"][:1500]

    # Step 3: Writer Chain
    research_combined = (
        f"SEARCH RESULTS:\n{state['search_results']}\n\n"
        f"DEEP SCRAPED CONTENT:\n{state['scraped_content']}\n\n"
        f"USER ATTACHED CONTEXT:\n{req.file_context or 'None'}"
    )
    state["report"] = writer_chain.invoke({
        "topic": topic,
        "research": research_combined
    })

    # Step 4: Critic Chain
    state["feedback"] = critic_chain.invoke({
        "report": state["report"]
    })

    return state


@app.get("/api/research/stream")
async def stream_research(topic: str, context: Optional[str] = "", doc_id: Optional[str] = ""):
    """Server-Sent Events (SSE) endpoint to stream agent progress live to React UI."""
    if not topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    if doc_id and doc_id in DOC_STORE:
        context = DOC_STORE[doc_id]

    async def event_generator():
        def sse(event_type: str, data: dict):
            return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

        state = {}
        try:
            # 1. Scout Agent (Fast Direct Search)
            yield sse("progress", {"step": "search", "status": "running", "message": "Scouting live internet & 2026 industry benchmarks..."})
            await asyncio.sleep(0.05)

            search_query = f"{topic} 2026"
            if context and any(k in context.lower() for k in ["resume", "cv", "experience", "education", "skills", "projects", "engineer", "developer"]):
                search_query = f"2026 industry hiring requirements skills salary benchmarks {topic}"

            try:
                raw_search = await asyncio.to_thread(web_search.invoke, {"query": search_query})
            except Exception as se:
                raw_search = f"Web discovery note: {str(se)}"

            state["search_results"] = raw_search or "Primary web benchmarks indexed."
            yield sse("progress", {"step": "search", "status": "done", "data": state["search_results"]})

            # 2. Scholar Agent (Fast DOM Scraping)
            yield sse("progress", {"step": "reader", "status": "running", "message": "Parsing DOM & mining source content..."})
            await asyncio.sleep(0.05)

            found_urls = extract_urls(state["search_results"])
            target_url = found_urls[0] if found_urls else ""

            if target_url:
                try:
                    scraped_text = await asyncio.to_thread(scrape_url.invoke, {"url": target_url})
                    if "Could not scrape" not in scraped_text and len(scraped_text) > 100:
                        state["scraped_content"] = f"Source URL: {target_url}\n\nContent:\n{scraped_text[:3000]}"
                    else:
                        state["scraped_content"] = f"Source: {target_url}\n\nKey Insights:\n" + state["search_results"][:1500]
                except Exception:
                    state["scraped_content"] = state["search_results"][:1500]
            else:
                state["scraped_content"] = state["search_results"][:1500]

            yield sse("progress", {"step": "reader", "status": "done", "data": state["scraped_content"]})

            # 3. Writer Chain
            yield sse("progress", {"step": "writer", "status": "running", "message": "Drafting multi-section comprehensive research report..."})
            await asyncio.sleep(0.1)

            research_combined = (
                f"SEARCH INTELLIGENCE:\n{state['search_results']}\n\n"
                f"DEEP SCRAPED WEB CONTENT:\n{state['scraped_content']}\n\n"
                f"ADDITIONAL USER CONTEXT:\n{context or 'None'}"
            )
            state["report"] = await asyncio.to_thread(writer_chain.invoke, {
                "topic": topic,
                "research": research_combined
            })
            yield sse("progress", {"step": "writer", "status": "done", "data": state["report"]})

            # 4. Critic Chain
            yield sse("progress", {"step": "critic", "status": "running", "message": "Running automated audit & quantitative scoring..."})
            await asyncio.sleep(0.1)

            state["feedback"] = await asyncio.to_thread(critic_chain.invoke, {
                "report": state["report"]
            })
            yield sse("progress", {"step": "critic", "status": "done", "data": state["feedback"]})

            # 5. Complete
            yield sse("complete", state)

        except Exception as e:
            yield sse("error", {"error": str(e)})

    return StreamingResponse(event_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
