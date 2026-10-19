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
    agent_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=800)
    writer_llm = ChatGroq(model=groq_model, temperature=0.1, max_tokens=2500)
    critic_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=900)
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


# 3rd - Scribe Agent (Dynamic: Deep Investigation OR Resume/Document Intelligence Dossier)
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are CogniX AI's elite Lead Research Analyst and Senior Career Intelligence Architect.
Format your output in clean, publication-ready GitHub-flavored Markdown.
Use clear headings (H1, H2, H3), bold text, bullet points, and markdown comparison tables.
Never truncate sentences or tables. Do NOT write placeholders or meta notes like 'Punchy overview', '(Concrete sections)', or '(Actionable next steps)'.
Always write genuine, comprehensive, high-value content.

SPECIAL INSTRUCTION FOR ATTACHED RESUMES / CV:
If the user provided an uploaded Resume or CV:
1. Executive Profile Evaluation: Give a professional summary of the candidate and estimated ATS Match Score (e.g., 88/100).
2. Skills Matrix (Markdown Table): Compare the Candidate's Existing Skills with 2026 Industry In-Demand Requirements and Priority Keywords.
3. Projects & Experience Review: Highlight key strengths, and rewrite 2-3 weak project bullet points using the Google/STAR (Situation-Task-Action-Result) formula with metrics.
4. Top 2026 Job Role Matches: Specific job titles, expected salary bands, and top companies hiring for this stack.
5. 30-Day Targeted Career Roadmap: A prioritized, high-leverage action plan to land high-paying offers.
"""),
    ("human", """Perform an exhaustive, deep investigation on the topic and context below.

Topic: {topic}

Intelligence & Uploaded Context:
{research}

Output your analysis following this clean structure:

# {topic}

## 1. Executive Summary & Assessment
Provide a 2-3 paragraph deep executive analysis evaluating the subject or candidate profile, key competitive strengths, and readiness score.

## 2. Deep Technical Breakdown & Market Insights
Provide detailed facts, architectural insights, and a Markdown Comparison Table highlighting key capabilities versus 2026 industry benchmarks.

## 3. Critical Gaps & 2026 Industry Challenges
Provide specific gaps, missing keywords, technical bottlenecks, or market hurdles.

## 4. Strategic Recommendations & Action Plan
Provide concrete, prioritized next steps, project enhancements, and implementation milestones.

## 5. Verified Sources & References
List verified source URLs found during research as clickable markdown links."""),
])

writer_chain = writer_prompt | writer_llm | StrOutputParser()


# 4th - Auditor Agent (Objective Peer Review & Scoring)
critic_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are CogniX AI's Chief Quality Auditor.
Evaluate research dossiers and resume audits on factual depth, structure, table completeness, and actionable value.
Your score should reflect the true quality and depth of the report:
- 8.5 to 10.0: Outstanding, detailed, with structured markdown tables, actionable steps, and clear evidence.
- 7.0 to 8.4: Good, solid analysis with minor areas for expansion.
- 5.0 to 6.9: Average, needs deeper technical details or more concrete examples.
- Below 5.0: Incomplete or missing sections."""),
    ("human", """Review the dossier below and provide an objective evaluation:

Report:
{report}

Provide your evaluation in this exact structured format:

Score: X/10

Strengths:
- (Strength 1)
- (Strength 2)
- (Strength 3)

Areas to Improve:
- (Critique 1)
- (Critique 2)

Strategic Verdict:
(One concise, high-level verdict on overall quality and readiness)"""),
])

critic_chain = critic_prompt | critic_llm | StrOutputParser()
