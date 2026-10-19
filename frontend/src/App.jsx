import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Target,
  Sparkles,
  Mail,
  PenTool,
  ShieldCheck,
  BookOpen,
  Copy,
  Check,
  Download,
  AlertTriangle
} from 'lucide-react';

import ParticleTerrain from './components/ParticleTerrain';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PromptBar from './components/PromptBar';
import AgentPipeline from './components/AgentPipeline';

import LiveJobsTab from './components/tabs/LiveJobsTab';
import AtsGapsTab from './components/tabs/AtsGapsTab';
import OutreachTab from './components/tabs/OutreachTab';
import DossierTab from './components/tabs/DossierTab';
import AuditorTab from './components/tabs/AuditorTab';
import EvidenceTab from './components/tabs/EvidenceTab';

import { getStoredJson } from './utils/storage';
import { extractClickableUrls } from './utils/parsers';
import { DEFAULT_RESUME_PROMPTS, DEFAULT_NOTES_PROMPTS } from './constants/prompts';

export default function App() {
  const savedActive = getStoredJson('cognix_active_work', null);

  const [topic, setTopic] = useState('');
  const [activeInquiry, setActiveInquiry] = useState(() => savedActive?.activeInquiry || '');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(() => savedActive?.activeTab || 'jobs');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Live Career & Job States
  const [liveJobs, setLiveJobs] = useState(() => savedActive?.liveJobs || []);
  const [atsGaps, setAtsGaps] = useState(() => savedActive?.atsGaps || null);
  const [starRewrites, setStarRewrites] = useState(() => savedActive?.starRewrites || []);
  const [outreach, setOutreach] = useState(() => savedActive?.outreach || null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [copiedJobIdx, setCopiedJobIdx] = useState(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');

  // Sidebar States
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('cognix_sidebar_expanded');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [researchMode, setResearchMode] = useState(() => savedActive?.researchMode || 'deep');

  // Attached Document (Active)
  const [attachedFile, setAttachedFile] = useState(() => savedActive?.attachedFile || null);
  const [fileContext, setFileContext] = useState(() => savedActive?.fileContext || '');
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);
  const reportBottomRef = useRef(null);

  // Document Vault & History (localStorage persistent)
  const [documentVault, setDocumentVault] = useState(() => getStoredJson('cognix_vault', []));
  const [history, setHistory] = useState(() => getStoredJson('cognix_history', []));

  // Agent Steps State
  const defaultSteps = {
    search: { status: 'idle', data: null, message: 'Ready to scout live openings' },
    reader: { status: 'idle', data: null, message: 'Waiting for Scout Agent handoff' },
    writer: { status: 'idle', data: null, message: 'Waiting for ATS Gap Analyzer' },
    critic: { status: 'idle', data: null, message: 'Waiting for STAR Rewriter' },
  };

  const [steps, setSteps] = useState(() => savedActive?.steps || defaultSteps);
  const [finalReport, setFinalReport] = useState(() => savedActive?.finalReport || '');
  const [criticFeedback, setCriticFeedback] = useState(() => savedActive?.criticFeedback || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cognix_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

  // Save document vault to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cognix_vault', JSON.stringify(documentVault));
    } catch (e) {
      console.error('Failed to save vault', e);
    }
  }, [documentVault]);

  // Save sidebar preference
  useEffect(() => {
    try {
      localStorage.setItem('cognix_sidebar_expanded', JSON.stringify(isSidebarExpanded));
    } catch (e) {
      console.error('Failed to save sidebar state', e);
    }
  }, [isSidebarExpanded]);

  // Save active work to localStorage so refreshing preserves active inquiry, report, steps, attached document
  useEffect(() => {
    try {
      if (activeInquiry || finalReport || attachedFile || liveJobs.length > 0) {
        localStorage.setItem(
          'cognix_active_work',
          JSON.stringify({
            activeInquiry,
            finalReport,
            criticFeedback,
            liveJobs,
            atsGaps,
            starRewrites,
            outreach,
            steps,
            attachedFile,
            fileContext,
            activeTab,
            researchMode,
          })
        );
      } else {
        localStorage.removeItem('cognix_active_work');
      }
    } catch (e) {
      console.error('Failed to save active work', e);
    }
  }, [activeInquiry, finalReport, criticFeedback, liveJobs, atsGaps, starRewrites, outreach, steps, attachedFile, fileContext, activeTab, researchMode]);

  // Real PDF / Document Parser via Backend
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      const newDoc = {
        id: Date.now(),
        docId: data.doc_id || '',
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        charCount: data.char_count || 0,
        text: data.text || '',
        docType: data.doc_type || 'document',
        pagesCount: data.pages_count || 1,
        suggestedPrompts: data.suggested_prompts || (data.doc_type === 'resume' ? DEFAULT_RESUME_PROMPTS : DEFAULT_NOTES_PROMPTS),
      };

      setFileContext(newDoc.text);
      setAttachedFile(newDoc);
      setDocumentVault((prev) => [newDoc, ...prev.filter((d) => d.name !== file.name)]);
      setIsMobileSidebarOpen(false);
    } catch (err) {
      console.error('Error uploading file:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fallbackText = event.target.result || '';
        const fallbackDoc = {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          charCount: fallbackText.length,
          text: fallbackText,
          docType: file.name.toLowerCase().includes('resume') ? 'resume' : 'document',
          pagesCount: 1,
          suggestedPrompts: DEFAULT_RESUME_PROMPTS,
        };
        setFileContext(fallbackText);
        setAttachedFile(fallbackDoc);
        setDocumentVault((prev) => [fallbackDoc, ...prev.filter((d) => d.name !== file.name)]);
      };
      reader.readAsText(file);
      setIsMobileSidebarOpen(false);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectVaultDoc = (doc) => {
    setAttachedFile(doc);
    setFileContext(doc.text);
    setIsMobileSidebarOpen(false);
  };

  const removeVaultDoc = (id, e) => {
    e.stopPropagation();
    setDocumentVault((prev) => prev.filter((d) => d.id !== id));
    if (attachedFile?.id === id) {
      setAttachedFile(null);
      setFileContext('');
    }
  };

  const detachCurrentFile = () => {
    setAttachedFile(null);
    setFileContext('');
  };

  const startNewSession = () => {
    setTopic('');
    setActiveInquiry('');
    setFinalReport('');
    setCriticFeedback('');
    setLiveJobs([]);
    setAtsGaps(null);
    setStarRewrites([]);
    setOutreach(null);
    setErrorMsg('');
    setSteps(defaultSteps);
    setAttachedFile(null);
    setFileContext('');
    setActiveTab('jobs');
    try {
      localStorage.removeItem('cognix_active_work');
    } catch (e) {}
    setIsMobileSidebarOpen(false);
  };

  const loadFromHistory = (item) => {
    setTopic('');
    setActiveInquiry(item.topic);
    setFinalReport(item.report);
    setCriticFeedback(item.feedback);
    setLiveJobs(item.live_jobs || []);
    setAtsGaps(item.ats_gap_analysis || null);
    setStarRewrites(item.star_rewrites || []);
    setOutreach(item.outreach || null);
    setSteps({
      search: { status: 'done', data: item.search_results, message: 'Restored from history' },
      reader: { status: 'done', data: item.scraped_content, message: 'Restored from history' },
      writer: { status: 'done', data: item.report, message: 'Restored from history' },
      critic: { status: 'done', data: item.feedback, message: 'Restored from history' },
    });
    setActiveTab(item.live_jobs && item.live_jobs.length > 0 ? 'jobs' : 'report');
    setIsMobileSidebarOpen(false);
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Clear all past research dossiers?')) {
      setHistory([]);
    }
  };

  // Trigger Autonomous Career & Job Hunting Pipeline with SSE stream
  const handleExecuteResearch = async (overrideQuery = null) => {
    const query = (overrideQuery || topic).trim();
    if (!query || isRunning) return;

    setActiveInquiry(query);
    setTopic('');

    setErrorMsg('');
    setFinalReport('');
    setCriticFeedback('');
    setLiveJobs([]);
    setAtsGaps(null);
    setStarRewrites([]);
    setOutreach(null);
    setIsRunning(true);
    setActiveTab('jobs');

    setSteps({
      search: { status: 'running', data: null, message: 'Scout Agent: Scouting live openings with direct apply links...' },
      reader: { status: 'waiting', data: null, message: 'Waiting for Scout Agent handoff' },
      writer: { status: 'waiting', data: null, message: 'Waiting for ATS Gap Analyzer' },
      critic: { status: 'waiting', data: null, message: 'Waiting for STAR Rewriter' },
    });

    try {
      const url =
        `/api/research/stream?topic=${encodeURIComponent(query)}` +
        (attachedFile?.docId
          ? `&doc_id=${encodeURIComponent(attachedFile.docId)}`
          : fileContext
          ? `&context=${encodeURIComponent(fileContext.slice(0, 1500))}`
          : '');
      const eventSource = new EventSource(url);

      eventSource.addEventListener('jobs_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.jobs) {
            setLiveJobs(payload.jobs);
            setActiveTab('jobs');
          }
        } catch (err) {}
      });

      eventSource.addEventListener('gaps_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.gaps) setAtsGaps(payload.gaps);
        } catch (err) {}
      });

      eventSource.addEventListener('rewrites_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.rewrites) setStarRewrites(payload.rewrites);
        } catch (err) {}
      });

      eventSource.addEventListener('outreach_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.outreach) setOutreach(payload.outreach);
        } catch (err) {}
      });

      eventSource.addEventListener('progress', (e) => {
        const payload = JSON.parse(e.data);
        const { step, status, message, data } = payload;

        setSteps((prev) => {
          const next = { ...prev };

          if (step === 'search' && status === 'done') {
            next.search = { status: 'done', data, message: 'Live job openings discovered' };
            next.reader = { status: 'running', data: null, message: 'ATS Gap Agent: Reverse-engineering hiring filters...' };
          } else if (step === 'reader' && status === 'done') {
            next.reader = { status: 'done', data, message: 'ATS gap diagnostics complete' };
            next.writer = { status: 'running', data: null, message: 'STAR Rewriter: Crafting 1-click project bullets...' };
          } else if (step === 'writer' && status === 'done') {
            next.writer = { status: 'done', data, message: 'STAR project rewrites synthesized' };
            next.critic = { status: 'running', data: null, message: 'Outreach Agent: Drafting cold email & LinkedIn DMs...' };
            setFinalReport(data);
          } else if (step === 'critic' && status === 'done') {
            next.critic = { status: 'done', data, message: 'Outreach templates generated' };
            setCriticFeedback(data);
          } else {
            next[step] = {
              ...next[step],
              status,
              message: message || next[step].message,
              data: data !== undefined ? data : next[step].data,
            };
          }

          return next;
        });
      });

      eventSource.addEventListener('complete', (e) => {
        const fullData = JSON.parse(e.data);
        if (fullData.report) setFinalReport(fullData.report);
        if (fullData.feedback) setCriticFeedback(fullData.feedback);
        if (fullData.live_jobs) setLiveJobs(fullData.live_jobs);
        if (fullData.ats_gap_analysis) setAtsGaps(fullData.ats_gap_analysis);
        if (fullData.star_rewrites) setStarRewrites(fullData.star_rewrites);
        if (fullData.outreach) setOutreach(fullData.outreach);
        setIsRunning(false);
        eventSource.close();

        const newEntry = {
          id: Date.now(),
          topic: query,
          attachedFileName: attachedFile?.name || null,
          docType: attachedFile?.docType || null,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          report: fullData.report,
          feedback: fullData.feedback,
          live_jobs: fullData.live_jobs || [],
          ats_gap_analysis: fullData.ats_gap_analysis || null,
          star_rewrites: fullData.star_rewrites || [],
          outreach: fullData.outreach || null,
          search_results: fullData.search_results,
          scraped_content: fullData.scraped_content,
        };
        setHistory((prev) => [newEntry, ...prev.slice(0, 29)]);
      });

      eventSource.addEventListener('error', (e) => {
        console.error('SSE connection closed/error', e);
        setIsRunning(false);
        eventSource.close();
      });
    } catch (err) {
      setErrorMsg(err.message || 'Execution error.');
      setIsRunning(false);
    }
  };

  const copyToClipboard = () => {
    if (!finalReport) return;
    navigator.clipboard.writeText(finalReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!finalReport) return;
    const blob = new Blob([finalReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = (activeInquiry || 'cognix_career').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${name}_dossier.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  const agents = [
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

  const searchUrls = extractClickableUrls(steps.search.data);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      {/* Anduril-inspired 3D Topographic Particle Terrain */}
      <ParticleTerrain />

      {/* Hidden File Input for uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.md,.json"
        className="hidden"
      />

      {/* Modular Sidebar */}
      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onStartNewSession={startNewSession}
        onTriggerUpload={() => fileInputRef.current?.click()}
        uploadingFile={uploadingFile}
        documentVault={documentVault}
        onSelectVaultDoc={selectVaultDoc}
        onRemoveVaultDoc={removeVaultDoc}
        attachedFile={attachedFile}
        researchMode={researchMode}
        setResearchMode={setResearchMode}
        showHowItWorks={showHowItWorks}
        setShowHowItWorks={setShowHowItWorks}
        history={history}
        onLoadFromHistory={loadFromHistory}
        onDeleteHistoryItem={deleteHistoryItem}
        onClearAllHistory={clearAllHistory}
      />

      {/* ── Main View Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          attachedFile={attachedFile}
          onDetachFile={detachCurrentFile}
          researchMode={researchMode}
          onStartNewSession={startNewSession}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Active Inquiry Header */}
          {activeInquiry && (
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="truncate">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  Target Role / Candidate Query
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white truncate tracking-tight">
                  {activeInquiry}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {attachedFile && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                    CV: {attachedFile.name}
                  </span>
                )}
                {isRunning && (
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs animate-pulse">
                    Autonomous Fleet Active
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Search & Prompt Action Bar */}
          <PromptBar
            topic={topic}
            setTopic={setTopic}
            attachedFile={attachedFile}
            onDetachFile={detachCurrentFile}
            onExecute={handleExecuteResearch}
            isRunning={isRunning}
            uploadingFile={uploadingFile}
            onTriggerUpload={() => fileInputRef.current?.click()}
          />

          {/* Multi-Agent Orchestration Pipeline */}
          <AgentPipeline agents={agents} steps={steps} />

          {/* Error Message Toast/Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Card with Modular Tabs */}
          {(finalReport || isRunning || liveJobs.length > 0) && (
            <div className="dark-card overflow-hidden">
              {/* Tabs Navigation */}
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

                {/* Score badge & utility actions */}
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

              {/* Tab 1: Live Openings with Direct Apply Links */}
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

              {/* Tab 2: ATS Gaps & STAR Bullets */}
              {activeTab === 'gaps' && (
                <AtsGapsTab
                  atsGaps={atsGaps}
                  starRewrites={starRewrites}
                  copiedBulletIdx={copiedBulletIdx}
                  setCopiedBulletIdx={setCopiedBulletIdx}
                />
              )}

              {/* Tab 3: 1-Click Ready Outreach Hub */}
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

              {/* Tab 4: Markdown Career Dossier */}
              {activeTab === 'report' && (
                <DossierTab
                  finalReport={finalReport}
                  reportBottomRef={reportBottomRef}
                />
              )}

              {/* Tab 5: Chief Auditor Strategic Verdict */}
              {activeTab === 'critic' && (
                <AuditorTab
                  criticFeedback={criticFeedback}
                  activeInquiry={activeInquiry}
                  attachedFile={attachedFile}
                  copied={copied}
                  setCopied={setCopied}
                />
              )}

              {/* Tab 6: Raw Discovered Evidence */}
              {activeTab === 'sources' && (
                <EvidenceTab
                  searchUrls={searchUrls}
                  steps={steps}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
