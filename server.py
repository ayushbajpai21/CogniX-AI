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

from agents import (
    career_agent_graph,
    job_scout_node,
    ats_gap_node,
    star_rewriter_node,
    outreach_node,
    dossier_synthesizer_node
)
from tools import search_live_jobs, scrape_url, get_nearby_companies

load_dotenv()

app = FastAPI(title="CogniX AI Career & Job Intelligence API", version="2.0.0")

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
        "architecture": "LangGraph Autonomous Career Multi-Agent StateGraph",
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
            "Find Live Job Openings & Match Score for My Resume",
            "Comprehensive ATS Gap Analysis & Missing 2026 Keywords",
            "Generate 1-Click STAR Formula Project Rewrites",
            "Generate Personalized Cold Email & LinkedIn Recruiter InMail"
        ]
    elif any(k in lowered for k in ["notes", "lecture", "chapter", "syllabus", "summary", "tutorial", "revision"]):
        doc_type = "notes"
        suggested_prompts = [
            "Extract Core Tech Skills & Find Matching Roles",
            "Deep Synthesis & Technical Interview Questions",
            "Cross-Reference Notes with 2026 Industry State"
        ]
    else:
        doc_type = "document"
        suggested_prompts = [
            "Analyze Document & Match with Live 2026 Roles",
            "Executive Summary & ATS Gap Diagnostics",
            "Actionable Technical Recommendations"
        ]

    # Generate an 8-character doc_id and cache text in server memory
    doc_id = uuid.uuid4().hex[:8]
    DOC_STORE[doc_id] = extracted_text

    return {
        "doc_id": doc_id,
        "filename": filename,
        "char_count": len(extracted_text),
        "doc_type": doc_type,
        "pages_count": pages_count,
        "suggested_prompts": suggested_prompts,
        "preview": extracted_text[:350] + ("..." if len(extracted_text) > 350 else ""),
        "text": extracted_text
    }


@app.post("/api/research")
def run_research(req: ResearchRequest):
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    initial_state = {
        "topic": topic,
        "target_role": topic,
        "resume_text": req.file_context or "",
        "live_jobs": [],
        "ats_gap_analysis": {},
        "star_rewrites": [],
        "outreach": {},
        "dossier": "",
        "critic_score": 8.8,
        "critic_feedback": ""
    }

    final_state = career_agent_graph.invoke(initial_state)
    companies = get_nearby_companies(final_state.get("target_role", topic))

    # Format response compatible with frontend
    return {
        "live_jobs": final_state.get("live_jobs", []),
        "nearby_companies": companies,
        "ats_gap_analysis": final_state.get("ats_gap_analysis", {}),
        "star_rewrites": final_state.get("star_rewrites", []),
        "outreach": final_state.get("outreach", {}),
        "report": final_state.get("dossier", ""),
        "feedback": final_state.get("critic_feedback", ""),
        "search_results": f"Found {len(final_state.get('live_jobs', []))} live jobs with direct apply links."
    }


@app.get("/api/research/stream")
async def stream_research(topic: str, context: Optional[str] = "", doc_id: Optional[str] = ""):
    """
    LangGraph-powered Server-Sent Events (SSE) streaming endpoint.
    Orchestrates the 4 autonomous career agents in real-time.
    """
    if not topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    if doc_id and doc_id in DOC_STORE:
        context = DOC_STORE[doc_id]

    async def event_generator():
        def sse(event_type: str, data: dict):
            return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

        state = {
            "topic": topic,
            "target_role": topic,
            "resume_text": context or "",
            "live_jobs": [],
            "nearby_companies": [],
            "ats_gap_analysis": {},
            "star_rewrites": [],
            "outreach": {},
            "dossier": "",
            "critic_score": 8.8,
            "critic_feedback": ""
        }

        try:
            # ── AGENT 1: Job Scout Agent (Direct Apply Links & Nearby Companies) ──
            yield sse("progress", {
                "step": "search",
                "status": "running",
                "message": f"Scout Agent: Aggregating live openings & tech hubs for '{topic}'..."
            })
            await asyncio.sleep(0.05)

            scout_res = await asyncio.to_thread(job_scout_node, state)
            state["live_jobs"] = scout_res.get("live_jobs", [])
            state["target_role"] = scout_res.get("target_role", topic)

            # Retrieve nearby tech companies with Google Maps links
            companies = get_nearby_companies(state["target_role"])
            state["nearby_companies"] = companies

            jobs_summary = f"Discovered {len(state['live_jobs'])} verified live openings across Remotive, LinkedIn, and Greenhouse."
            state["search_results"] = jobs_summary

            yield sse("jobs_update", {"jobs": state["live_jobs"]})
            yield sse("companies_update", {"companies": state["nearby_companies"]})
            yield sse("progress", {
                "step": "search",
                "status": "done",
                "message": f"Found {len(state['live_jobs'])} live openings & {len(state['nearby_companies'])} nearby tech hubs.",
                "data": json.dumps(state["live_jobs"][:3])
            })

            # ── AGENT 2: ATS Gap Analyzer Agent ──
            yield sse("progress", {
                "step": "reader",
                "status": "running",
                "message": "ATS Gap Agent: Reverse-engineering 2026 hiring filters & keyword gaps..."
            })
            await asyncio.sleep(0.05)

            ats_res = await asyncio.to_thread(ats_gap_node, state)
            state["ats_gap_analysis"] = ats_res.get("ats_gap_analysis", {})

            yield sse("gaps_update", {"gaps": state["ats_gap_analysis"]})
            yield sse("progress", {
                "step": "reader",
                "status": "done",
                "message": f"ATS Score: {state['ats_gap_analysis'].get('ats_score', 88)}% ({state['ats_gap_analysis'].get('fit_tier', 'Competitive')})",
                "data": json.dumps(state["ats_gap_analysis"])
            })

            # ── AGENT 3: STAR Project Rewriter Agent ──
            yield sse("progress", {
                "step": "writer",
                "status": "running",
                "message": "STAR Rewriter: Transforming project bullets into metrics-driven STAR formula..."
            })
            await asyncio.sleep(0.05)

            star_res = await asyncio.to_thread(star_rewriter_node, state)
            state["star_rewrites"] = star_res.get("star_rewrites", [])

            yield sse("rewrites_update", {"rewrites": state["star_rewrites"]})
            yield sse("progress", {
                "step": "writer",
                "status": "done",
                "message": f"Generated {len(state['star_rewrites'])} 1-click STAR project rewrites.",
                "data": json.dumps(state["star_rewrites"])
            })

            # ── AGENT 4: Cold Outreach & Pitch Agent ──
            yield sse("progress", {
                "step": "critic",
                "status": "running",
                "message": "Outreach Agent: Synthesizing 6 ready-to-send message styles & Job Report..."
            })
            await asyncio.sleep(0.05)

            outreach_res = await asyncio.to_thread(outreach_node, state)
            state["outreach"] = outreach_res.get("outreach", {})

            yield sse("outreach_update", {"outreach": state["outreach"]})

            # Compile complete Job Report AFTER outreach is fully populated
            dossier_res = await asyncio.to_thread(dossier_synthesizer_node, state)
            state["dossier"] = dossier_res.get("dossier", "")
            state["report"] = state["dossier"]
            state["critic_score"] = dossier_res.get("critic_score", 8.8)
            state["critic_feedback"] = dossier_res.get("critic_feedback", "")

            yield sse("progress", {
                "step": "critic",
                "status": "done",
                "message": "6 outreach styles & complete Job Report ready.",
                "data": state["critic_feedback"]
            })

            # ── Complete Event with Full LangGraph State ──
            yield sse("complete", {
                "live_jobs": state["live_jobs"],
                "nearby_companies": state["nearby_companies"],
                "ats_gap_analysis": state["ats_gap_analysis"],
                "star_rewrites": state["star_rewrites"],
                "outreach": state["outreach"],
                "report": state["report"],
                "feedback": state["critic_feedback"],
                "search_results": jobs_summary,
                "scraped_content": json.dumps(state["ats_gap_analysis"])
            })

        except Exception as e:
            print(f"[Error in Stream]: {e}")
            yield sse("error", {"error": str(e)})

    return StreamingResponse(event_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
