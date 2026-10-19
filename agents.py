import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, scrape_url

load_dotenv()

# Model setup: prioritize Groq with fallback to OpenAI
groq_api_key = os.getenv("GROQ_API_KEY")

if groq_api_key:
    from langchain_groq import ChatGroq
    groq_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    # Agents (search/reader): fast, focused tokens
    agent_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=600)
    # Writer: needs more room for full structured reports without truncation
    writer_llm = ChatGroq(model=groq_model, temperature=0.1, max_tokens=1400)
    # Critic: focused evaluation
    critic_llm = ChatGroq(model=groq_model, temperature=0, max_tokens=700)
else:
    from langchain_openai import ChatOpenAI
    agent_llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0)
    writer_llm = agent_llm
    critic_llm = agent_llm


# 1st Agent - Search Agent
def build_search_agent():
    return create_agent(
        model=agent_llm,
        tools=[web_search]
    )


# 2nd Agent - Reader Agent
def build_reader_agent():
    return create_agent(
        model=agent_llm,
        tools=[scrape_url]
    )


# 3rd - Writer Chain
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite research analyst and writer. Your job is to produce a comprehensive, authoritative, and cleanly structured research report based on the provided intelligence.
Format using clean, modern GitHub-flavored Markdown:
- Use clear H1, H2 (##) and H3 (###) headers.
- If using tables, always complete every row and close table syntax properly.
- Use bold text, well-organized bullet lists, and highlight critical insights.
- Never leave sentences or sections unfinished or truncated."""),
    ("human", """Write a complete, professional research report on the topic below.

Research Topic: {topic}

Gathered Research & Scraped Content:
{research}

Structure your report clearly as follows:
# {topic} — Comprehensive Research Report

## 1. Executive Summary
(A concise, powerful 2-3 paragraph overview of the current state, major breakthroughs, and practical significance)

## 2. Key Findings & Detailed Analysis
(Provide 3-5 comprehensive, well-explained thematic points with concrete facts, data, and context)

## 3. Challenges & Future Outlook
(Real-world roadblocks, risks, and projected developments for 2026 and beyond)

## 4. Conclusion & Key Takeaways
(Final actionable verdict and strategic summary)

## 5. Reference Sources
(List all extracted source URLs as clickable markdown links: - [Source Title](URL))

Ensure the report is complete, insightful, highly readable, and thoroughly detailed."""),
])

writer_chain = writer_prompt | writer_llm | StrOutputParser()


# 4th - Critic Chain
critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an objective, rigorous senior research reviewer. Evaluate reports strictly on factual clarity, completeness, depth, and actionable insight."),
    ("human", """Evaluate the research report below.

Report:
{report}

Provide your evaluation in this exact structured format:

Score: X/10

Strengths:
- (Detailed positive observation 1)
- (Detailed positive observation 2)
- (Detailed positive observation 3)

Areas to Improve:
- (Constructive critique 1)
- (Constructive critique 2)

Strategic Verdict:
(One sharp, executive-level summary statement evaluating the overall quality and reliability of the research)"""),
])

critic_chain = critic_prompt | critic_llm | StrOutputParser()
