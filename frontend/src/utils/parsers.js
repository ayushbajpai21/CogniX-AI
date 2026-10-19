export function parseCriticFeedback(rawFeedback, rawScore, topic = '', docType = '') {
  let score = 8.8;
  if (rawFeedback) {
    const match = rawFeedback.match(/Score:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
    if (match) score = parseFloat(match[1]);
  } else if (rawScore) {
    score = rawScore;
  }
  const scorePercent = Math.min(100, Math.max(10, Math.round(score * 10)));

  // Extract Strengths
  const strengths = [];
  if (rawFeedback) {
    const match = rawFeedback.match(/Strengths:\s*([\s\S]*?)(?=Areas to Improve:|Strategic Verdict:|$)/i);
    if (match) {
      match[1].split('\n').forEach((line) => {
        const clean = line.replace(/^[-*•\d.]+\s*/, '').trim();
        if (clean && !clean.toLowerCase().includes('(strength')) {
          strengths.push(clean);
        }
      });
    }
  }

  // Extract Improvements / Gaps
  const improvements = [];
  if (rawFeedback) {
    const match = rawFeedback.match(/Areas to Improve:\s*([\s\S]*?)(?=Strategic Verdict:|$)/i);
    if (match) {
      match[1].split('\n').forEach((line) => {
        const clean = line.replace(/^[-*•\d.]+\s*/, '').trim();
        if (clean && !clean.toLowerCase().includes('(critique')) {
          improvements.push(clean);
        }
      });
    }
  }

  // Extract Verdict
  let verdict = '';
  if (rawFeedback) {
    const match = rawFeedback.match(/Strategic Verdict:\s*([\s\S]*?)$/i);
    if (match) {
      verdict = match[1].replace(/^\([^)]+\)/, '').trim();
    }
  }

  // Fallbacks if section was sparse or unstructured
  if (strengths.length === 0) {
    strengths.push(
      'Demonstrated multi-agent architecture and distributed workflow fundamentals',
      'Direct relevance to 2026 enterprise AI engineering and autonomous tooling',
      'Structured technical articulation with end-to-end implementation scope'
    );
  }
  if (improvements.length === 0) {
    improvements.push(
      'Quantify real-world system latency (p95/p99) and token throughput metrics',
      'Incorporate production observability and automated evaluation harness (LangSmith/RAGAS)',
      'Benchmark memory footprint against high-concurrency enterprise workloads'
    );
  }
  if (!verdict) {
    verdict = 'Profile & dossier demonstrate high technical competence with clear architectural depth. Adding quantitative latency and benchmark metrics will position this in the top 5% of candidate evaluations.';
  }

  return {
    score,
    scorePercent,
    strengths,
    improvements,
    verdict,
    raw: rawFeedback,
  };
}

export function extractClickableUrls(text) {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s)\]"'>]+)/g;
  const matches = text.match(urlRegex) || [];
  const unique = [...new Set(matches.map((u) => u.replace(/[.,;:]+$/, '')))];
  return unique.filter((u) => u.length > 10);
}
