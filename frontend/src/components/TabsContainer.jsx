import React from 'react';
import {
  Briefcase,
  Target,
  Mail,
  FileText,
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

    return (
      <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-750 flex items-center gap-1.5 text-xs font-mono">
        <span className="text-zinc-400">Review Score:</span>
        <span className="font-bold text-cyan-400">{scoreVal} / 10</span>
      </div>
    );
  };

  return (
    <div className="dark-card overflow-hidden border border-zinc-800">
      {/* Tabs Navigation Header */}
      <div className="border-b border-zinc-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-[#0d0d12]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Live Jobs</span>
            {liveJobs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-black/20 text-current">
                {liveJobs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gaps'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Skill Gaps & Bullets</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'outreach'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Outreach Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'report'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Report</span>
          </button>

          <button
            onClick={() => setActiveTab('critic')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'critic'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profile Review</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sources'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sources & Links</span>
          </button>
        </div>

        {/* Score Badge & Actions */}
        <div className="flex items-center gap-2">
          {getScoreBadge()}
          {finalReport && (
            <div className="flex items-center gap-1">
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 border border-zinc-800 transition-all"
                title="Copy entire report"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={downloadReport}
                className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 border border-zinc-800 transition-all"
                title="Download report as markdown"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-xs">Export .md</span>
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
