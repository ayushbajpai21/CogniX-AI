# CogniX-AI — Autonomous Career & Job Intelligence Fleet

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-purple.svg)](https://langchain-ai.github.io/langgraph/)
[![Groq LPU](https://img.shields.io/badge/Inference-Groq_LPU-orange.svg)](https://groq.com/)

**CogniX-AI** is a production-grade autonomous multi-agent intelligence fleet built for freshers, students, and engineers. It automatically discovers live verified job openings with **direct application/career portal links** (eliminating dead redirects and generic homepages), runs deep ATS gap diagnostics, crafts 1-click copy-ready **STAR formula project rewrites**, and generates tailored, high-conversion **Cold Emails & LinkedIn InMail DMs**.

---

## 🌟 The 5-Node LangGraph Agent Fleet

Unlike single-prompt wrappers, CogniX-AI orchestrates an autonomous directed acyclic graph (DAG) using **LangGraph**:

```
[Candidate Resume / Query]
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 🔍 Job Scout Agent                                       │
│    Mines live openings with direct apply links from         │
│    verified career feeds (Remotive, Arbeitnow, Jobicy)      │
│    with sub-second latency and zero dead redirects.         │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Discovered Openings + Match Score)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 🎯 ATS Gap Diagnostic Agent                              │
│    Reverse-engineers 2026 hiring algorithms, calculates ATS  │
│    match score, isolates missing keywords, and flags risks. │
└───────────────────────────┬─────────────────────────────────┘
                            │ (ATS Gaps & Missing 2026 Keywords)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ✨ STAR Bullet Point Optimizer                           │
│    Transforms weak resume project descriptions into         │
│    metrics-driven STAR bullets (1-click copyable).          │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Optimized High-Signal Bullets)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. 📬 1-Click Outreach Hub Agent                            │
│    Drafts personalized cold emails (Subject + Body),        │
│    recruiter LinkedIn InMail (<300 chars), and cover notes. │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Outreach Templates)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. 📑 Career Dossier Synthesizer & Chief Auditor            │
│    Generates executive markdown dossier, 30-day action      │
│    roadmap, and quantitative 1-10 quality seal audit.       │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Server-Sent Events Stream)
                            ▼
[React 19 Cybernetic Workspace + Anduril 3D Particle Terrain]
```

---

## 🚀 Key Features

### 1. 💼 Verified Live Jobs with Direct Apply Links
- Direct apply links to company job posts (Greenhouse, Lever, Remotive, LinkedIn).
- No generic search engine landing pages or broken redirects.
- Filter by: **All Roles**, **Remote / Worldwide**, and **Direct ATS**.

### 2. 🎯 2026 ATS Gap Diagnostics
- Instant ATS compatibility score (e.g. 88% Match).
- Identifies missing high-demand keywords (e.g. `LangGraph`, `vLLM`, `Docker`, `RAGAS`, `Vector Indexing`).
- 1-click click-to-copy for all suggested keywords.

### 3. ✨ 1-Click STAR Bullet Rewrites
- Transforms passive bullets into high-signal recruiter magnets:
  - **Before:** *"Built a multi-agent AI system with Python to search web and analyze PDF files."*
  - **After:** *"Architected an autonomous 4-agent distributed intelligence pipeline in Python & LangGraph, slashing research retrieval latency by 78% (sub-10s) while processing multi-format documents with 100% factual grounding."*

### 4. 📬 Ready-to-Send Outreach Hub
- **Hiring Manager Cold Email:** High-converting subject line + customized body.
- **LinkedIn InMail / DM:** Calibrated strictly under 300 characters to fit LinkedIn's free invitation connection limit.
- **150-Word Quick Cover Note:** Perfect for fast direct portal submissions.

### 5. 🌐 Anduril 3D Topographic Particle Canvas
- GPU-accelerated interactive particle canvas background inspired by modern defense-tech design.
- Interactive mouse-reactive field and dynamic flowing contours.

### 6. 📁 Clean Modular Architecture
- Strict separation of concerns across React components:
  - `components/Navbar.jsx`
  - `components/Sidebar.jsx` (Collapsible 72px Icon Rail)
  - `components/PromptBar.jsx`
  - `components/AgentPipeline.jsx`
  - `components/ParticleTerrain.jsx`
  - `components/tabs/LiveJobsTab.jsx`
  - `components/tabs/AtsGapsTab.jsx`
  - `components/tabs/OutreachTab.jsx`
  - `components/tabs/DossierTab.jsx`
  - `components/tabs/AuditorTab.jsx`
  - `components/tabs/EvidenceTab.jsx`
  - `utils/storage.js`, `utils/parsers.js`, `constants/prompts.js`

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Orchestration** | LangGraph, LangChain Core |
| **Inference** | Groq LPU (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`) |
| **Backend & Streaming** | FastAPI, Server-Sent Events (SSE), Python 3.10+ |
| **Job Feeds & Parsing** | Remotive API, Arbeitnow API, Jobicy, PyPDF, BeautifulSoup4 |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React, HTML5 Canvas |

---

## 💻 Quickstart & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Groq API Key](https://console.groq.com) (free tier available)

### 2. Clone the Repository
```bash
git clone https://github.com/ayushbajpai21/CogniX-AI.git
cd CogniX-AI
```

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### 5. Run Development Servers

**Start Backend (Port 8000):**
```bash
python server.py
```

**Start Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📄 License
MIT License. Built for students, engineers, and ambitious builders.
