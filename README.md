# ResearchMind AI — Autonomous Multi-Agent Research System

A production-grade, collaborative multi-agent investigation engine designed to perform end-to-end research on any topic without single-model hallucinations. Powered by **LangChain**, **Groq LPU (`openai/gpt-oss-20b`)**, **Tavily AI Search**, **BeautifulSoup4**, and a modern **React + Vite + Tailwind CSS** frontend.

---

## 🌟 Architecture Overview

Instead of querying a single static LLM, **ResearchMind** deploys a sequential team of 4 specialized autonomous agents:

```
[User Query + Optional Document Context]
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 🔍 Scout Agent (Live Web Discovery)                      │
│    Queries Tavily AI Search with automatic DuckDuckGo       │
│    fallback to identify fresh, authoritative sources.       │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Extracted Active URL)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 📄 Scholar Agent (Deep DOM Extraction)                   │
│    Visits source webpages, parses the DOM, cleans script    │
│    and ad tags via BeautifulSoup, and extracts deep text.   │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Search + Scraped + User File Context)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ✍️ Scribe Agent (Analytical Synthesis)                    │
│    Synthesizes intelligence into a multi-section Markdown   │
│    report (Executive Summary, Key Findings, Risks, Sources).│
└───────────────────────────┬─────────────────────────────────┘
                            │ (Full Draft)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ⚖️ Auditor Agent (Autonomous Peer Review)                │
│    Audits the report for factual consistency, completeness, │
│    and provides a quantitative score (1-10) with critique.  │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Server-Sent Events Stream)
                            ▼
[React 3D Minimal Dark Dashboard + Markdown GFM Tables + Persistent History]
```

---

## 🚀 Key Features

- **Sequential Agent Handoff:** Visual signals track progress as each agent works while subsequent agents remain locked on standby until receiving handoff data.
- **Ultra-Fast Low-Token Inference:** Powered by Groq's `openai/gpt-oss-20b`, delivering sub-second completions with minimal token consumption.
- **Automated Fallback Search:** Primary searches run via Tavily; automatically routes to DuckDuckGo if quota is exceeded.
- **Document & Resume Context:** Supports `.pdf`, `.txt`, and `.md` uploads via FastAPI + `pypdf` for hybrid document-grounded research (e.g. matching jobs against an uploaded resume).
- **Persistent Investigation History:** Stores previous research sessions in `localStorage` with instant reload and export.
- **Clean Markdown & Table Rendering:** Formatted tables, callout blocks, and clickable reference source links rendered via `remark-gfm`.

---

## 🛠️ Tech Stack

- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic
- **Agent Orchestration:** LangChain, LangGraph, LCEL (LangChain Expression Language)
- **Inference Acceleration:** Groq LPU (`openai/gpt-oss-20b`) / OpenAI compatible
- **Search & Scraping:** Tavily Search API, DuckDuckGo Search, BeautifulSoup4, Requests
- **Document Processing:** PyPDF
- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, React-Markdown, Remark-GFM

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Multi-agent-research-system
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
GROQ_MAX_TOKENS=600
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 🖥️ Running the Application

### Start the Backend (FastAPI):
```bash
python server.py
```
*API available at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`)*

### Start the Frontend (React + Vite):
```bash
cd frontend
npm run dev
```
*Web dashboard available at `http://localhost:5173`*

---

## 📂 Project Structure

```text
Multi-agent-research-system/
├── .env                       # API keys (Protected via .gitignore)
├── .gitignore                 # Excludes env, cache, and node_modules
├── requirements.txt           # Python dependencies
├── README.md                  # Project documentation
│
├── server.py                  # FastAPI server with SSE streaming & PDF parser
├── agents.py                  # LangChain agents (Scout, Scholar, Scribe, Auditor)
├── tools.py                   # Tavily + DuckDuckGo search & BeautifulSoup scraper
├── pipeline.py                # Standalone CLI pipeline runner
│
└── frontend/                  # React + Vite + Tailwind CSS Application
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx            # Main interactive dashboard with sidebar & agents
    │   ├── index.css          # Minimalist dark theme & GFM table styles
    │   └── main.jsx
    └── public/
```

---

## 📄 License

MIT License. Free to use, modify, and distribute.
