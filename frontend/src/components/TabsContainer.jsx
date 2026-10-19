import React from 'react';
import {
  Briefcase,
  Target,
  Mail,
  PenTool,
  ShieldCheck,
  BookOpen,
  Copy,
  Check,
  Download
} from 'lucide-react';

import LiveJobsTab from './tabs/LiveJobsTab';
import AtsGapsTab from './tabs/AtsGapsTab';
import OutreachTab from './tabs/OutreachTab';
import DossierTab from './tabs/DossierTab';
import AuditorTab from './tabs/AuditorTab';
import EvidenceTab from './tabs/EvidenceTab';

export default function TabsContainer({
  activeTab,
  setActiveTab,
  liveJobs,
  atsGaps,
  starRewrites,
  outreach,
  finalReport,
  criticFeedback,
  steps,
  searchUrls,
  jobFilter,
  setJobFilter,
  copiedJobIdx,
  setCopiedJobIdx,
  copiedBulletIdx,
  setCopiedBulletIdx,
  copiedEmail,
  setCopiedEmail,
  copiedDm,
  setCopiedDm,
  copiedCover,
  setCopiedCover,
  copied,
  setCopied,
  copyToClipboard,
  downloadReport,
  reportBottomRef,
  activeInquiry,
  attachedFile
}) {
  const getScoreBadge = () => {
    if (!criticFeedback) return null;
    const match = criticFeedback.match(/Score:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
    const scoreVal = match ? parseFloat(match[1]) : null;
    if (scoreVal === null) return null;

    let color = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    if (scoreVal < 6) color = 'text-red-400 border-red-500/40 bg-red-950/30';
    else if (scoreVal < 8) color = 'text-amber-400 border-amber-500/40 bg-amber-950/30';

    return (
      <div className={`px-2.5 sm:px-3 py-1 rounded-md border flex items-center gap-1.5 font-mono text-xs font-bold ${color}`}>
        <span>AUDIT SCORE:</span>
        <span className="text-sm">{scoreVal}/10</span>
      </div>
    );
  };

  return (
    <div className="dark-card overflow-hidden">
      {/* Tabs Navigation Header */}
      <div className="border-b border-zinc-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-[#0d0d12]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Live Openings</span>
            {liveJobs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-black/30 text-current">
                {liveJobs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gaps'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>ATS Gaps & STAR Bullets</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'outreach'
                ? 'bg-purple-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1-Click Outreach Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'report'
                ? 'bg-zinc-700 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Career Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('critic')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'critic'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditor Review</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sources'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Evidence</span>
          </button>
        </div>

        {/* Score Badge & Actions */}
        <div className="flex items-center gap-2">
          {getScoreBadge()}
          {finalReport && (
            <div className="flex items-center gap-1">
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={downloadReport}
                className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-all"
                title="Export Markdown Document"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Export .md</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'jobs' && (
        <LiveJobsTab
          liveJobs={liveJobs}
          jobFilter={jobFilter}
          setJobFilter={setJobFilter}
          onGoToOutreach={() => setActiveTab('outreach')}
          copiedJobIdx={copiedJobIdx}
          setCopiedJobIdx={setCopiedJobIdx}
        />
      )}

      {activeTab === 'gaps' && (
        <AtsGapsTab
          atsGaps={atsGaps}
          starRewrites={starRewrites}
          copiedBulletIdx={copiedBulletIdx}
          setCopiedBulletIdx={setCopiedBulletIdx}
        />
      )}

      {activeTab === 'outreach' && (
        <OutreachTab
          outreach={outreach}
          copiedEmail={copiedEmail}
          setCopiedEmail={setCopiedEmail}
          copiedDm={copiedDm}
          setCopiedDm={setCopiedDm}
          copiedCover={copiedCover}
          setCopiedCover={setCopiedCover}
        />
      )}

      {activeTab === 'report' && (
        <DossierTab
          finalReport={finalReport}
          reportBottomRef={reportBottomRef}
        />
      )}

      {activeTab === 'critic' && (
        <AuditorTab
          criticFeedback={criticFeedback}
          activeInquiry={activeInquiry}
          attachedFile={attachedFile}
          copied={copied}
          setCopied={setCopied}
        />
      )}

      {activeTab === 'sources' && (
        <EvidenceTab
          searchUrls={searchUrls}
          steps={steps}
        />
      )}
    </div>
  );
}
