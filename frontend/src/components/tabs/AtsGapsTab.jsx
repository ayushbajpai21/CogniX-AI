import React, { useState } from 'react';
import { Target, CheckCircle2, Copy, Check, RefreshCw } from 'lucide-react';

export default function AtsGapsTab({
  atsGaps,
  starRewrites = [],
  copiedBulletIdx,
  setCopiedBulletIdx
}) {
  // Variant selection map per project index: 0 = Variant 1 (Metrics), 1 = Variant 2 (Architecture)
  const [selectedVariants, setSelectedVariants] = useState({});

  const toggleVariant = (idx) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [idx]: prev[idx] === 1 ? 0 : 1,
    }));
  };

  if (!atsGaps) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-2">
        <Target className="w-5 h-5 animate-spin text-cyan-400" />
        <p className="text-xs">Analyzing resume skills and matching against target jobs...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Top Match Score Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Resume Skill Match & Review
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono">
              {atsGaps.fit_tier || 'Strong Match'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Comparison of your skills against current job market expectations and recruiter filters.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <span className="text-zinc-400">Match Score:</span>
          <span className="text-base font-bold text-cyan-400">{atsGaps.ats_score || 85}%</span>
        </div>
      </div>

      {/* Keywords to Add & Current Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Keywords */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              Skills & Keywords to Add
            </span>
            <span className="text-[11px] text-zinc-500">Click to copy</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(atsGaps.missing_keywords || ['Docker', 'MongoDB', 'REST APIs', 'AWS', 'Git']).map((kw, i) => (
              <button
                key={i}
                onClick={() => navigator.clipboard.writeText(kw)}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-750 text-zinc-200 hover:text-cyan-300 hover:border-cyan-500/40 text-xs flex items-center gap-1 transition-all"
                title="Click to copy skill"
              >
                <span>+ {kw}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Adding these keywords into your project descriptions and skills section directly improves resume shortlisting.
          </p>
        </div>

        {/* Verified Strengths */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              Your Strong Areas
            </span>
            <span className="text-[11px] text-emerald-400">Verified</span>
          </div>

          <div className="space-y-2">
            {(atsGaps.verified_strengths || ['Solid full-stack development foundation', 'Practical project architecture']).map((st, i) => (
              <div key={i} className="p-2.5 rounded bg-zinc-900 border border-zinc-850 text-xs text-zinc-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improved Resume Project Points (With Switch Version Button) */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-850 pb-2.5">
          <div>
            <h4 className="text-xs font-semibold text-white">
              Better Project Descriptions (STAR Format)
            </h4>
            <p className="text-[11px] text-zinc-400">
              High-impact bullet points ready to copy onto your resume. Use the <strong>Switch Version</strong> button to swap between Metric and Architecture focus.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(starRewrites && starRewrites.length > 0 ? starRewrites : [
            {
              project_name: 'Full-Stack Web Application',
              before_bullet: 'Built a web application with React and Node to manage data.',
              after_bullet: 'Developed full-stack web application with React & Node.js, improving response times by 45% and supporting 1,000+ active users.',
              after_bullet_v2: 'Architected scalable MERN web application with modular REST APIs, secure JWT authentication, and responsive UI design.',
              skills_highlighted: ['React', 'Node.js', 'Express', 'MongoDB']
            }
          ]).map((rw, idx) => {
            const currentVariant = selectedVariants[idx] || 0;
            const activeAfterText = currentVariant === 1 && rw.after_bullet_v2 ? rw.after_bullet_v2 : rw.after_bullet;

            return (
              <div key={idx} className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-medium text-white">
                    {rw.project_name || `Project ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(rw.skills_highlighted || []).map((sk, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 text-xs text-zinc-400">
                    <span className="text-[11px] text-zinc-500 block font-medium mb-1">
                      Before (Basic / Weak):
                    </span>
                    "{rw.before_bullet}"
                  </div>

                  {/* After with Switch Version and Copy Buttons */}
                  <div className="p-2.5 rounded bg-zinc-950 border border-cyan-500/30 text-xs text-zinc-100 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                        Recommended ({currentVariant === 1 ? 'Architecture Focus' : 'Metrics Focus'}):
                      </span>

                      <div className="flex items-center gap-1">
                        {rw.after_bullet_v2 && (
                          <button
                            onClick={() => toggleVariant(idx)}
                            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-zinc-750 text-[10px] flex items-center gap-1 transition-all"
                            title="Switch to alternative project bullet"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>{currentVariant === 0 ? 'Switch Version' : 'Revert'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeAfterText);
                            setCopiedBulletIdx(idx);
                            setTimeout(() => setCopiedBulletIdx(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[10px] flex items-center gap-1 transition-all"
                        >
                          {copiedBulletIdx === idx ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedBulletIdx === idx ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                      "{activeAfterText}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
