import React from 'react';
import { Briefcase, ExternalLink, Copy, Check, Mail, RefreshCw, MapPin, Clock } from 'lucide-react';

export default function LiveJobsTab({
  liveJobs = [],
  jobFilter = 'all',
  setJobFilter,
  onGoToOutreach,
  copiedJobIdx,
  setCopiedJobIdx
}) {
  const filteredJobs = liveJobs.filter((j) => {
    const loc = (j.location || '').toLowerCase();
    const cat = (j.category || '').toLowerCase();

    if (jobFilter === 'india') {
      return (
        cat === 'india' ||
        loc.includes('india') ||
        loc.includes('noida') ||
        loc.includes('bangalore') ||
        loc.includes('bengaluru') ||
        loc.includes('delhi') ||
        loc.includes('gurgaon') ||
        loc.includes('hyderabad') ||
        loc.includes('pune') ||
        loc.includes('mumbai')
      );
    }
    if (jobFilter === 'remote') {
      return cat === 'remote' || loc.includes('remote') || loc.includes('worldwide') || loc.includes('anywhere');
    }
    if (jobFilter === 'foreign') {
      return cat === 'foreign' || loc.includes('usa') || loc.includes('us') || loc.includes('europe') || loc.includes('uk');
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Verified Live Jobs
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono">
              {filteredJobs.length} Active Openings
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Verified direct application links — opens directly to active job postings without broken redirects.
          </p>
        </div>

        {/* Location Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-400 mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'india', label: '🇮🇳 India Jobs' },
            { id: 'remote', label: '🌐 Remote' },
            { id: 'foreign', label: '🏢 Foreign / US' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setJobFilter(btn.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                jobFilter === btn.id
                  ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredJobs.map((job, idx) => (
            <div
              key={job.id || idx}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <span className="text-xs font-semibold text-cyan-400 block truncate">
                      {job.company}
                    </span>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {job.title}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.match_score || 90}% Match
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {job.platform}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1 shrink-0 text-emerald-400 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    {job.posted_time || 'Active Now'}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {job.snippet}
                </p>

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(job.apply_url);
                      setCopiedJobIdx(idx);
                      setTimeout(() => setCopiedJobIdx(null), 2000);
                    }}
                    className="p-1.5 px-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1 border border-zinc-800"
                    title="Copy direct apply URL"
                  >
                    {copiedJobIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Link</span>
                  </button>

                  <button
                    onClick={onGoToOutreach}
                    className="p-1.5 px-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-300 transition-colors text-xs flex items-center gap-1 border border-zinc-800"
                    title="Open Outreach Email Template"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Send Message</span>
                  </button>
                </div>

                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <p className="text-xs">Finding active verified openings for this location...</p>
        </div>
      )}
    </div>
  );
}
