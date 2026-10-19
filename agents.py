import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_url

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

if groq_api_key:
    from langchain_groq import ChatGroq
    groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    agent_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=600)
    writer_llm = ChatGroq(model=groq_model, temperature=0.1, max_tokens=1500)
    critic_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=700)
else:
    from langchain_openai import ChatOpenAI
    agent_llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0)
    writer_llm = agent_llm
    critic_llm = agent_llm


# 1st Agent - Scout Agent
def build_search_agent():
    return create_agent(
        model=agent_llm,
        tools=[web_search]
    )


# 2nd Agent - Scholar Agent
def build_reader_agent():
    return create_agent(
        model=agent_llm,
        tools=[scrape_url]
    )


# 3rd - Scribe Agent (Dynamic: General Research OR Document/Resume Deep Analysis)
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite research analyst, document intelligence specialist, and senior technical career auditor.
Format your output using clean GitHub-flavored Markdown (H1, H2, tables, bold text, bullet points).
Never truncate tables or sentences. Provide full, insightful, actionable content.

SPECIAL INSTRUCTION FOR ATTACHED RESUMES / CV / NOTES:
If the user provided an uploaded Resume, CV, or Notes document:
1. Deeply analyze the candidate's actual skills, education, projects, and work experience from the document.
2. Cross-reference their profile against current 2026 industry benchmarks and job market requirements discovered in the research.
3. Structure your response as an exhaustive, high-impact Dossier:
   - Profile Breakdown & Estimated ATS Pass Score (0-100%)
   - Technical Stack Matrix: Skills Present vs. High-Priority 2026 Missing Skills (in a Markdown Table)
   - Projects & Experience Review: Standout highlights + Before/After STAR bullet point rewrites
   - Best-Fit 2026 Roles & Target Companies (e.g. AI Engineer, Full-Stack, Systems Engineer)
   - 30-Day High-Impact Action Plan to land interviews"""),
    ("human", """Perform a complete investigation on the topic and context below.

Topic: {topic}

Intelligence & Uploaded Context:
{research}

Output your analysis following this clean structure:

# {topic}

## 1. Executive Summary & Profile Assessment
(Punchy overview evaluating the subject or candidate profile, core strengths, and readiness score)

## 2. Key Findings & Detailed Analysis
(Concrete sections with facts, extracted skills/data, markdown comparison tables, and market alignment)

## 3. Critical Gaps, Roadblocks & Market Benchmarks
(Specific shortcomings, missing skills/keywords, or emerging challenges in 2026)

## 4. Strategic Recommendations & Action Plan
(Actionable next steps, bullet rewrites, and target milestones)

## 5. Reference Sources
(List verified URLs found during research as clickable markdown links)"""),
])

writer_chain = writer_prompt | writer_llm | StrOutputParser()


# 4th - Auditor Agent
critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an objective senior reviewer. Evaluate research reports and document analyses on factual accuracy, depth, actionable value, and completeness."),
    ("human", """Review the report below.

Report:
{report}

Provide your evaluation in this exact structured format:

Score: X/10

Strengths:
- (Strength point 1)
- (Strength point 2)
- (Strength point 3)

Areas to Improve:
- (Critique 1)
- (Critique 2)

Strategic Verdict:
(One sharp, executive-level verdict on overall quality and readiness)"""),
])

critic_chain = critic_prompt | critic_llm | StrOutputParser()
