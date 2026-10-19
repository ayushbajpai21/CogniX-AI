import React from 'react';
import { Briefcase, Target, Sparkles, Mail, AlertTriangle } from 'lucide-react';

import ParticleTerrain from './components/ParticleTerrain';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PromptBar from './components/PromptBar';
import AgentPipeline from './components/AgentPipeline';
import TabsContainer from './components/TabsContainer';
import { useCareerResearch } from './hooks/useCareerResearch';
import { extractClickableUrls } from './utils/parsers';

const AGENTS = [
  {
    id: 'search',
    num: '01',
    title: 'Job Scout Agent',
    desc: 'Live Openings & Direct Career Link Mining',
    icon: Briefcase,
  },
  {
    id: 'reader',
    num: '02',
    title: 'ATS Gap Analyzer',
    desc: '2026 Hiring Filters & Keyword Diagnostics',
    icon: Target,
  },
  {
    id: 'writer',
    num: '03',
    title: 'STAR Rewriter Agent',
    desc: '1-Click High-Impact Resume Project Bullets',
    icon: Sparkles,
  },
  {
    id: 'critic',
    num: '04',
    title: 'Outreach & Pitch Agent',
    desc: 'Personalized Cold Emails & LinkedIn DMs',
    icon: Mail,
  },
];

export default function App() {
  const research = useCareerResearch();
  const searchUrls = extractClickableUrls(research.steps.search.data);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* 3D Topographic Particle Canvas */}
      <ParticleTerrain />

      {/* Hidden File Input for uploading */}
      <input
        type="file"
        ref={research.fileInputRef}
        onChange={research.handleFileUpload}
        accept=".pdf,.txt,.md,.json"
        className="hidden"
      />

      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        isSidebarExpanded={research.isSidebarExpanded}
        setIsSidebarExpanded={research.setIsSidebarExpanded}
        isMobileSidebarOpen={research.isMobileSidebarOpen}
        setIsMobileSidebarOpen={research.setIsMobileSidebarOpen}
        onStartNewSession={research.startNewSession}
        onTriggerUpload={() => research.fileInputRef.current?.click()}
        uploadingFile={research.uploadingFile}
        documentVault={research.documentVault}
        onSelectVaultDoc={research.selectVaultDoc}
        onRemoveVaultDoc={research.removeVaultDoc}
        attachedFile={research.attachedFile}
        researchMode={research.researchMode}
        setResearchMode={research.setResearchMode}
        showHowItWorks={research.showHowItWorks}
        setShowHowItWorks={research.setShowHowItWorks}
        history={research.history}
        onLoadFromHistory={research.loadFromHistory}
        onDeleteHistoryItem={research.deleteHistoryItem}
        onClearAllHistory={research.clearAllHistory}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar
          onOpenMobileSidebar={() => research.setIsMobileSidebarOpen(true)}
          attachedFile={research.attachedFile}
          onDetachFile={research.detachCurrentFile}
          researchMode={research.researchMode}
          onStartNewSession={research.startNewSession}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Active Target Role Banner */}
          {research.activeInquiry && (
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="truncate">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  Target Role / Candidate Query
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white truncate tracking-tight">
                  {research.activeInquiry}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {research.attachedFile && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                    CV: {research.attachedFile.name}
                  </span>
                )}
                {research.isRunning && (
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs animate-pulse">
                    Autonomous Fleet Active
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Search & Prompt Action Bar */}
          <PromptBar
            topic={research.topic}
            setTopic={research.setTopic}
            attachedFile={research.attachedFile}
            onDetachFile={research.detachCurrentFile}
            onExecute={research.handleExecuteResearch}
            isRunning={research.isRunning}
            uploadingFile={research.uploadingFile}
            onTriggerUpload={() => research.fileInputRef.current?.click()}
          />

          {/* Multi-Agent Orchestration Pipeline */}
          <AgentPipeline agents={AGENTS} steps={research.steps} />

          {/* Error Message Toast */}
          {research.errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{research.errorMsg}</span>
            </div>
          )}

          {/* Modular Tabs Container (Live Jobs, ATS Gaps, Outreach Hub, Dossier, Auditor, Evidence) */}
          {(research.finalReport || research.isRunning || research.liveJobs.length > 0) && (
            <TabsContainer
              activeTab={research.activeTab}
              setActiveTab={research.setActiveTab}
              liveJobs={research.liveJobs}
              atsGaps={research.atsGaps}
              starRewrites={research.starRewrites}
              outreach={research.outreach}
              finalReport={research.finalReport}
              criticFeedback={research.criticFeedback}
              steps={research.steps}
              searchUrls={searchUrls}
              jobFilter={research.jobFilter}
              setJobFilter={research.setJobFilter}
              copiedJobIdx={research.copiedJobIdx}
              setCopiedJobIdx={research.setCopiedJobIdx}
              copiedBulletIdx={research.copiedBulletIdx}
              setCopiedBulletIdx={research.setCopiedBulletIdx}
              copiedEmail={research.copiedEmail}
              setCopiedEmail={research.setCopiedEmail}
              copiedDm={research.copiedDm}
              setCopiedDm={research.setCopiedDm}
              copiedCover={research.copiedCover}
              setCopiedCover={research.setCopiedCover}
              copied={research.copied}
              setCopied={research.setCopied}
              copyToClipboard={research.copyToClipboard}
              downloadReport={research.downloadReport}
              reportBottomRef={research.reportBottomRef}
              activeInquiry={research.activeInquiry}
              attachedFile={research.attachedFile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
