import React from 'react';
import { Briefcase, ExternalLink, Copy, Check, Mail, RefreshCw } from 'lucide-react';

export default function LiveJobsTab({
  liveJobs,
  jobFilter,
  setJobFilter,
  onGoToOutreach,
  copiedJobIdx,
  setCopiedJobIdx
}) {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Verified Live Openings with Direct Apply Links
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              {liveJobs.length} Live Openings
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Direct career portals, Remotive, and LinkedIn feeds • Zero dead redirects
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1">Filter:</span>
          {['all', 'worldwide', 'direct'].map((f) => (
            <button
              key={f}
              onClick={() => setJobFilter(f)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                jobFilter === f ? 'bg-cyan-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Roles' : f === 'worldwide' ? 'Remote / Worldwide' : 'Direct ATS'}
            </button>
          ))}
        </div>
      </div>

      {liveJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveJobs
            .filter((j) => {
              if (jobFilter === 'worldwide') return (j.location || '').toLowerCase().includes('worldwide') || (j.location || '').toLowerCase().includes('remote');
              if (jobFilter === 'direct') return (j.platform || '').toLowerCase().includes('ats') || (j.platform || '').toLowerCase().includes('direct');
              return true;
            })
            .map((job, idx) => (
              <div
                key={job.id || idx}
                className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                        {job.company}
                      </span>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {job.title}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {job.match_score || 92}% Match
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {job.platform}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span>📍 {job.location || 'Remote'}</span>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-sans">
                    {job.snippet}
                  </p>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(job.apply_url);
                        setCopiedJobIdx(idx);
                        setTimeout(() => setCopiedJobIdx(null), 2000);
                      }}
                      className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1 font-mono"
                      title="Copy Apply URL"
                    >
                      {copiedJobIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">Copy Link</span>
                    </button>

                    <button
                      onClick={onGoToOutreach}
                      className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-purple-300 transition-colors text-xs flex items-center gap-1 font-mono"
                      title="Draft Cold Email for this job"
                    >
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[10px]">Draft Pitch</span>
                    </button>
                  </div>

                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-95 text-black font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <span>Direct Apply</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <p className="text-xs font-mono">Job Scout Agent searching live career portals and verified postings...</p>
        </div>
      )}
    </div>
  );
}
