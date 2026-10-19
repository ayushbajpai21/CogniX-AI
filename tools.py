import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain.tools import tool

load_dotenv()

@tool
def web_search(query: str) -> str:
    """Search the web for recent and reliable information on a topic. Returns Titles, URLs and snippets.
    Uses Tavily Search with automatic fallback to DuckDuckGo if quota is exceeded."""
    tavily_key = os.getenv("TAVILY_API_KEY")
    out = []

    # Try Tavily first if key is present
    if tavily_key:
        try:
            from tavily import TavilyClient
            tavily = TavilyClient(api_key=tavily_key)
            results = tavily.search(query=query, max_results=5)
            for r in results.get("results", []):
                out.append(
                    f"Title: {r.get('title', 'N/A')}\nURL: {r.get('url', '')}\nSnippet: {r.get('content', '')[:300]}\n"
                )
            if out:
                return "\n----\n".join(out)
        except Exception as e:
            print(f"[Warning] Tavily search error or quota exceeded ({e}). Falling back to DuckDuckGo...")

    # Fallback to DuckDuckGo search (100% free, no quota)
    try:
        from duckduckgo_search import DDGS
        ddgs = DDGS()
        results = ddgs.text(query, max_results=5)
        for r in results:
            out.append(
                f"Title: {r.get('title', 'N/A')}\nURL: {r.get('href', '')}\nSnippet: {r.get('body', '')[:300]}\n"
            )
        if out:
            return "\n----\n".join(out)
    except Exception as e:
        print(f"[Error] DuckDuckGo fallback also failed: {e}")

    return "No search results found."


@tool
def scrape_url(url: str) -> str:
    """Scrape and return clean text content from a given URL for deeper reading."""
    if not url or not url.startswith("http"):
        return "Invalid URL provided for scraping."
    try:
        resp = requests.get(
            url,
            timeout=5,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        )
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "form"]):
            tag.decompose()
        clean_text = soup.get_text(separator=" ", strip=True)
        # Limit to 3000 chars to conserve tokens
        return clean_text[:3000] if clean_text else "Page loaded but no readable text found."
    except Exception as e:
        return f"Could not scrape URL ({url}): {str(e)}"
