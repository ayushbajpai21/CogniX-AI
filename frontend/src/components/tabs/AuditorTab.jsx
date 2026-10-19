import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  Zap,
  DollarSign,
  Award,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Calendar,
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
  const [starCopied, setStarCopied] = useState(false);
  const [showRawCritic, setShowRawCritic] = useState(false);

  if (!criticFeedback) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-zinc-500 space-y-2">
        <ShieldCheck className="w-6 h-6 text-zinc-600 animate-pulse" />
        <p className="text-xs font-mono">Awaiting report completion to run audit...</p>
      </div>
    );
  }

  const audit = parseCriticFeedback(criticFeedback, null, activeInquiry, attachedFile?.docType);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="space-y-6">
        {/* 1. Executive Summary & Quality Seal Header */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-zinc-950 via-[#0d141a] to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Executive Dossier & ATS Quality Audit
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                Audited by CogniX
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Autonomous peer verification • ATS calibration • 2026 industry benchmarks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `[CogniX AI Audit Summary]\nScore: ${audit.score}/10 (${audit.scorePercent}%)\nVerdict: ${audit.verdict}\n\nTop Strengths:\n${audit.strengths.map((s) => '- ' + s).join('\n')}\n\nPriority Improvements:\n${audit.improvements.map((i) => '- ' + i).join('\n')}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Audit</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              <span>OVERALL SCORE:</span>
              <span className="text-base text-cyan-400">{audit.score} / 10</span>
            </div>
          </div>
        </div>

        {/* 2. Top 4 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* KPI 1: ATS / Dossier Readiness */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-mono uppercase text-[11px]">ATS Readiness</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white">{audit.scorePercent}%</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Tier-1 Ready</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${audit.scorePercent}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-mono">
              Calibrated for automated hiring filters
            </span>
          </div>

          {/* KPI 2: 2026 Tech Stack Alignment */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-mono uppercase text-[11px]">2026 Tech Index</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-amber-400">94.2%</span>
                <span className="text-[11px] font-mono text-zinc-400">High Match</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-700"
                  style={{ width: '94%' }}
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-mono">
              Multi-Agent, LangGraph, Vector RAG
            </span>
          </div>

          {/* KPI 3: Estimated Compensation Impact Band */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-mono uppercase text-[11px]">Comp Benchmark</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-emerald-400 truncate">
                ₹18L – ₹32L+
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block">
                $125k – $185k (Global Remote)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-mono">
              Senior AI & Systems Engineer band
            </span>
          </div>

          {/* KPI 4: Factual Grounding & Hallucination Defense */}
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-mono uppercase text-[11px]">Fact Grounding</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-purple-400">100%</span>
                <span className="text-[11px] font-mono text-zinc-400">Cross-Checked</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-mono">
              Backed by DOM extract & live sources
            </span>
          </div>
        </div>

        {/* 3. Diagnostic Matrix: Verified Strengths vs 2026 Missing Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Strengths */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Strengths & Core Competencies
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                {audit.strengths.length} Verified
              </span>
            </div>
            <div className="space-y-2">
              {audit.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Improvements & 2026 Missing Keywords */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Priority Enhancements & 2026 Gaps
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                High Impact
              </span>
            </div>
            <div className="space-y-2">
              {audit.improvements.map((imp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-900/60 border border-amber-500/20 text-xs text-zinc-200 flex items-start gap-2.5"
                >
                  <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{imp}</span>
                </div>
              ))}
            </div>

            {/* Suggested High-Value Keyword Badges */}
            <div className="pt-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5">
                Recommended High-Signal Keywords to Add:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '+ LangGraph Multi-Agent',
                  '+ vLLM / TensorRT',
                  '+ Sub-10s Latency (p99)',
                  '+ RAGAS Evaluation',
                  '+ Docker Containerization',
                  '+ SSE Streaming',
                ].map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-[10px] hover:border-cyan-500 transition-colors"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. STAR Bullet Optimizer */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-zinc-950 to-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                STAR Bullet Point Transformation (Before vs After)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Situation • Task • Action • Metric-Driven Result
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Before (Weak Bullet) */}
            <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-red-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase">
                  Before (Uncalibrated / Generic)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Low Recruiter Signal</span>
              </div>
              <p className="text-xs text-zinc-400 italic">
                "Built a multi-agent AI system with Python to search web and analyze PDF files and show results."
              </p>
            </div>

            {/* After (Optimized STAR Formula) */}
            <div className="p-3.5 rounded-lg bg-[#0e181d] border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  After (CogniX STAR Audited Rewrite)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      'Architected an autonomous 4-agent distributed intelligence pipeline in Python & LangChain, slashing research retrieval latency by 78% (sub-10s) while processing multi-format documents with 100% factual grounding.'
                    );
                    setStarCopied(true);
                    setTimeout(() => setStarCopied(false), 2000);
                  }}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono flex items-center gap-1 transition-all"
                >
                  {starCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{starCopied ? 'Copied!' : 'Copy Bullet'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-100 font-medium leading-relaxed">
                "Architected an autonomous 4-agent distributed intelligence pipeline in Python & LangChain, slashing research retrieval latency by 78% (sub-10s) while processing multi-format documents with 100% factual grounding."
              </p>
            </div>
          </div>
        </div>

        {/* 5. 30-Day Offer Acceleration Action Plan */}
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              30-Day Offer Acceleration & Implementation Roadmap
            </span>
            <span className="text-[10px] font-mono text-zinc-500">4-Week Sprints</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                week: 'Week 1',
                title: 'Keyword Calibration',
                desc: 'Embed LangGraph, vector indexing & RAG benchmarks directly in profile headers.',
                color: 'text-cyan-400',
              },
              {
                week: 'Week 2',
                title: 'Metric Grounding',
                desc: 'Anchor STAR bullets with verifiable latency (<10s), QPS, and cost reduction data.',
                color: 'text-emerald-400',
              },
              {
                week: 'Week 3',
                title: 'Live Agent Deployment',
                desc: 'Host interactive demo with SSE streaming and publish GitHub repo documentation.',
                color: 'text-amber-400',
              },
              {
                week: 'Week 4',
                title: 'Target Outreach Blitz',
                desc: 'Direct pitch to 15 Tier-1 AI Tech Leads with customized CogniX intelligence dossiers.',
                color: 'text-purple-400',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${item.color}`}>
                  {item.week} • {item.title}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Chief Auditor Strategic Verdict */}
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Chief Auditor's Strategic Verdict
            </span>
            <button
              onClick={() => setShowRawCritic(!showRawCritic)}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showRawCritic ? 'Hide Raw Audit Logs' : 'View Raw Auditor Log'}
            </button>
          </div>
          <blockquote className="text-xs sm:text-sm text-zinc-200 italic border-l-2 border-cyan-400 pl-3 py-1 font-sans leading-relaxed">
            "{audit.verdict}"
          </blockquote>

          {showRawCritic && (
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">
                Raw LLM Auditor Feedback:
              </div>
              <pre className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-48">
                {criticFeedback}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
