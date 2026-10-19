# CogniX-AI — Autonomous Career & Job Intelligence Fleet

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-purple.svg)](https://langchain-ai.github.io/langgraph/)
[![Groq LPU](https://img.shields.io/badge/Inference-Groq_LPU-orange.svg)](https://groq.com/)

**CogniX-AI** is a production-grade autonomous career and job-hunting AI system engineered for freshers, students, and software engineers. It automates the entire job search lifecycle: finding live openings with **direct apply links**, performing **ATS gap analysis**, rewriting resume project bullets using the **STAR formula**, and generating **ready-to-send cold emails and LinkedIn DMs**.

---

## 💡 Why CogniX-AI? (Project Explanation)

Most job search tools return generic company homepages, outdated job listings, or dead redirects. Furthermore, freshers and students often struggle with:
1. **Finding Real Jobs:** Getting exact application links rather than generic company landing pages.
2. **ATS Screening Rejection:** Missing modern keywords (e.g., `LangGraph`, `vLLM`, `Vector Indexing`, `Docker`).
3. **Weak Project Descriptions:** Resume bullet points that lack quantifiable metrics and clear problem-solution context.
4. **Outreach Anxiety:** Not knowing how to write high-converting cold emails or concise recruiter LinkedIn messages.

**CogniX-AI** solves this end-to-end by orchestrating a fleet of specialized autonomous agents that handle each step in seconds.

---

## ⚙️ How It Works (Agent Workflow & Working)

CogniX-AI is powered by an autonomous directed acyclic graph (DAG) built with **LangGraph**:

```
[Candidate Query or Uploaded Resume/PDF]
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 🔍 Job Scout Agent                                       │
│    Mines real, active openings from verified feeds          │
│    (Remotive, Arbeitnow, Jobicy) and returns direct apply   │
│    portal URLs with zero dead redirects.                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Discovered Openings + Match Score)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 🎯 ATS Gap Diagnostic Agent                              │
│    Cross-references candidate skills against 2026 hiring    │
│    benchmarks, calculates ATS score (e.g. 88%), and flags   │
│    missing high-demand keywords.                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ (ATS Fit Score + Missing Keywords)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ✨ STAR Bullet Optimizer                                 │
│    Transforms weak resume project bullets into high-impact  │
│    STAR formula statements (Situation, Task, Action, Result)│
│    with 1-click copy support.                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Audited Project Bullets)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. 📬 1-Click Outreach Hub Agent                            │
│    Generates personalized Cold Emails (Subject + Body)      │
│    and recruiter LinkedIn InMails calibrated under 300      │
│    characters for free invitation notes.                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Outreach Templates)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. 📑 Career Dossier Synthesizer & Chief Auditor            │
│    Assembles an executive markdown dossier, 30-day action   │
│    roadmap, and quantitative 1-10 quality audit seal.       │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Server-Sent Events Stream)
                            ▼
[Live UI with Real-Time Updates & 3D Topographic Particle Canvas]
```

---

## 🚀 Key Features

- **Direct Apply Links Only:** Every discovered job includes an exact direct application URL (Greenhouse, Lever, Remotive, LinkedIn).
- **ATS Match Diagnostics:** Evaluates applicant profiles against current hiring filters and provides 1-click copyable missing keywords.
- **STAR Formula Rewrites:** Converts generic descriptions (*"Built an AI system to search web"*) into metric-driven statements (*"Architected an autonomous 4-agent distributed intelligence pipeline in Python & LangGraph, slashing retrieval latency by 78%"*).
- **Ready-to-Paste Outreach:** Instant cold email drafts for hiring managers and connection notes for recruiters — no prompting or drafting required.
- **Sub-10s Execution:** Powered by Groq LPU (`openai/gpt-oss-20b`) for ultra-low latency response streaming.
- **Interactive 3D Particle Canvas:** Topographic particle background inspired by modern defense-tech interfaces.
- **Document Vault & Persistence:** Upload resumes or notes (PDF, TXT, MD) with persistent state across browser refreshes via localStorage.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Agent Orchestration** | LangGraph, LangChain Core |
| **Fast LLM Inference** | Groq LPU (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`) |
| **Backend & Streaming** | FastAPI, Server-Sent Events (SSE), Python 3.10+ |
| **Job Feeds & Parsers** | Remotive API, Arbeitnow API, Jobicy API, PyPDF, BeautifulSoup4 |
| **Frontend UI** | React 19, Vite, Tailwind CSS, Lucide React, HTML5 Canvas |

---

## 💻 How to Run (Step-by-Step Guide)

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Groq API Key** (Free key available at [console.groq.com](https://console.groq.com))

### 2. Clone the Repository
```bash
git clone https://github.com/ayushbajpai21/CogniX-AI.git
cd CogniX-AI
```

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure your Groq API Key
# Create a .env file in the root directory:
echo GROQ_API_KEY=your_groq_api_key_here > .env
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### 5. Start the Application

**Terminal 1 — Run Backend Server (Port 8000):**
```bash
python server.py
```

**Terminal 2 — Run Frontend Dev Server (Port 5173):**
```bash
cd frontend
npm run dev
```

Open your browser and visit: **`http://localhost:5173`**

---

## 📄 License
MIT License. Built for students, engineers, and developers seeking career acceleration.
