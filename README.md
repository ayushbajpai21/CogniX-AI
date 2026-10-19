# CogniX AI — Autonomous Multi-Agent Intelligence System

A production-grade, collaborative multi-agent research & career intelligence engine designed to perform end-to-end investigation, real-time web discovery, and comprehensive resume ATS gap analysis in under 10 seconds without single-model hallucinations.

Powered by **LangChain**, **Groq LPU (`openai/gpt-oss-20b`)**, **Tavily AI Search**, **BeautifulSoup4**, **FastAPI (SSE Streaming)**, and a modern **React 19 + Vite + Tailwind CSS** frontend with a collapsible Icon Rail sidebar and cybernetic dark aesthetics.

---

## 🌟 4-Agent Autonomous Pipeline

Instead of relying on a single static LLM, **CogniX AI** orchestrates a sequential team of 4 specialized autonomous agents:

```
[User Query / Uploaded Resume or Notes PDF]
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 🔍 Scout Agent (Live Web & Benchmark Discovery)          │
│    Queries Tavily AI Search with automatic DuckDuckGo       │
│    fallback to identify fresh 2026 industry standards.      │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Extracted Active URL)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 📄 Scholar Agent (Deep DOM Extraction & Verification)    │
│    Visits source webpages, parses the DOM, cleans script    │
│    and ad tags via BeautifulSoup, and extracts deep text.   │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Live Web + Scraped + Resume Context)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ✍️ Scribe Agent (Dossier & ATS Gap Synthesis)             │
│    Synthesizes intelligence into a 5,000+ character dossier:│
│    ATS score, skill matrix table, STAR bullet rewrites, etc.│
└───────────────────────────┬─────────────────────────────────┘
                            │ (Complete Draft)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ⚖️ Auditor Agent (Objective Peer Review & Scoring)       │
│    Audits the dossier for factual depth and completeness,   │
│    issuing an objective quantitative score (1-10) & verdict.│
└───────────────────────────┬─────────────────────────────────┘
                            │ (Server-Sent Events Stream)
                            ▼
[React 19 Minimal Dark Workspace + Icon Rail + Markdown GFM Tables]
```

---

## 🚀 Key Features

- **⚡ Lightning-Fast Execution (< 10 Seconds):** Scout and Scholar agents execute fast direct async web queries and DOM extraction, eliminating slow multi-turn deliberation loops.
- **📄 Resume Intelligence & ATS Gap Engine:** Upload any PDF or document. The engine automatically identifies candidates' projects, tech stack, and calculates ATS compatibility with 2026 live hiring standards, delivering a skills comparison matrix and STAR bullet point rewrites.
- **🗂️ Collapsible Icon Rail Sidebar:** Smoothly transitions into a sleek 72px icon rail on desktop (with hovering tooltips) and an off-canvas drawer on mobile.
- **🔒 Sequential Visual Locking:** Distinct animated cards show live status: active agent pulses, completed agents show green checks, and pending agents remain locked on standby until receiving handoff data.
- **🔗 Clickable Real Evidence Links:** Discovered sources render as verified clickable hyperlinks (`<a target="_blank">`) directly in the Evidence tab.
- **💾 Document Vault & Persistent History:** In-session document vault with instant attachment, plus browser `localStorage` history for past research dossiers.
- **📑 Markdown GFM & Tables:** Clean GitHub-flavored markdown with styled tables, callouts, copy to clipboard, and one-click `.md` export.

---

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Asynchronous REST & Server-Sent Events (SSE) streaming API.
- **LangChain Core**: Chains, prompt templates, and streaming output parsers.
- **Groq LPU (`openai/gpt-oss-20b`)**: Sub-second low-latency inference.
- **Tavily AI & DuckDuckGo Search**: Real-time web discovery with automated fallback.
- **PyPDF**: Binary PDF text extractor for resumes, notes, and research documents.
- **BeautifulSoup4**: HTML parsing and clean DOM content extraction.

### Frontend
- **React 19 & Vite 8**: Ultra-fast build with HMR.
- **Tailwind CSS v4**: Minimalist matte dark theme (`#09090b` canvas with cyan/amber accents).
- **Lucide React**: Clean, functional SVG iconography.
- **ReactMarkdown & Remark-GFM**: GitHub-flavored markdown tables and syntax rendering.

---

## 💻 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Active API Keys:
  - [Groq API Key](https://console.groq.com)
  - [Tavily API Key](https://app.tavily.com) (Optional, DuckDuckGo fallback is automatic)

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Multi-agent-research-system.git
   cd Multi-agent-research-system
   ```

2. **Install Python backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure Environment Variables (`.env`):**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=gsk_your_groq_key_here
   TAVILY_API_KEY=tvly_your_tavily_key_here
   GROQ_MODEL=openai/gpt-oss-20b
   ```

---

## 🏃 Running the Application

### Option A: Run Both Servers

1. **Start FastAPI Backend (Port 8000):**
   ```bash
   python server.py
   ```

2. **Start Vite React Frontend (Port 5173):**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open **`http://localhost:5173`** in your browser.

---

## 📄 License
MIT License. Built for production-grade agentic workflows.
