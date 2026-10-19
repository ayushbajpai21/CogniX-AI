import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { parseCriticFeedback } from '../../utils/parsers';

export default function AuditorTab({
  criticFeedback,
  activeInquiry,
  attachedFile,
  copied,
  setCopied
}) {
  const [showRawCritic, setShowRawCritic] = useState(false);

  if (!criticFeedback) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-2">
        <ShieldCheck className="w-5 h-5 text-zinc-500 animate-pulse" />
        <p className="text-xs">Awaiting profile review to complete...</p>
      </div>
    );
  }

  const audit = parseCriticFeedback(criticFeedback, null, activeInquiry, attachedFile?.docType);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Resume & Profile Review
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 text-cyan-300 font-mono">
              Evaluated
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Automated check against modern industry hiring filters and technical job requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `[Review Summary]\nScore: ${audit.score}/10 (${audit.scorePercent}%)\nVerdict: ${audit.verdict}\n\nTop Strengths:\n${audit.strengths.map((s) => '- ' + s).join('\n')}\n\nPriority Improvements:\n${audit.improvements.map((i) => '- ' + i).join('\n')}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Review</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 text-xs font-mono">
            <span className="text-zinc-400 mr-1.5">Score:</span>
            <span className="text-base font-bold text-cyan-400">{audit.score} / 10</span>
          </div>
        </div>
      </div>

      {/* 2 Main Columns: Strengths vs Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Strengths */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Profile Strengths
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {audit.strengths.length} Found
            </span>
          </div>

          <div className="space-y-2">
            {audit.strengths.map((str, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-850 text-xs text-zinc-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Improvements */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              Recommended Improvements
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Action Items
            </span>
          </div>

          <div className="space-y-2">
            {audit.improvements.map((imp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-850 text-xs text-zinc-200 flex items-start gap-2.5"
              >
                <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{imp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Verdict */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">
            Final Recommendation & Verdict
          </span>
          <button
            onClick={() => setShowRawCritic(!showRawCritic)}
            className="text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            {showRawCritic ? 'Hide Details' : 'View Full Details'}
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed border-l-2 border-cyan-400 pl-3 py-1 font-sans">
          "{audit.verdict}"
        </p>

        {showRawCritic && (
          <div className="mt-3 pt-3 border-t border-zinc-850">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">
              Raw Evaluator Log:
            </div>
            <pre className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-48 font-mono">
              {criticFeedback}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
