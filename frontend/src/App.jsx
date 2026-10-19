import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  PenTool,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
  FileText,
  Upload,
  X,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Menu,
  Clock,
  Layers,
  Cpu,
  FileUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Futuristic Cybernetic AI Agent Logo (CogniX AI Neural Nexus)
function BrandLogo({ className = "w-9 h-9" }) {
  return (
    <div className={`relative ${className} shrink-0`}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(34,211,238,0.25)]">
        <defs>
          <linearGradient id="cyberCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="cyberShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <linearGradient id="glowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="glowAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Cyber Shield */}
        <polygon
          points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill="url(#cyberShield)"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeOpacity="0.45"
        />

        {/* Inner High-Tech Energy Grid */}
        <polygon
          points="50,16 80,33 80,67 50,84 20,67 20,33"
          stroke="url(#cyberCore)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          strokeOpacity="0.75"
        />

        {/* Central Multi-Agent Neural Nexus ('X' Core) */}
        <path
          d="M34 32 L66 68 M66 32 L34 68"
          stroke="url(#cyberCore)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M50 20 L50 40 M50 60 L50 80"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* 4 Autonomous Agent Orbit Nodes */}
        <circle cx="50" cy="18" r="4" fill="url(#glowCyan)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="78" cy="50" r="4" fill="url(#glowAmber)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="82" r="4" fill="url(#glowAmber)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="22" cy="50" r="4" fill="url(#glowCyan)" stroke="#ffffff" strokeWidth="1.5" />

        {/* Central Quantum Node */}
        <circle cx="50" cy="50" r="5" fill="#ffffff" />
      </svg>
    </div>
  );
}

const SUGGESTED_TOPICS = [
  "Agentic AI Architecture 2026",
  "AI Engineer Resume ATS Benchmarks",
  "Distributed LLM Serving & vLLM",
  "DeepSeek R1 vs Claude 3.5 Sonnet"
];

const DEFAULT_RESUME_PROMPTS = [
  "Comprehensive Resume Audit & ATS Gap Analysis",
  "2026 Live Market Role Match & Salary Benchmarks",
  "Skill Gap Breakdown & 30-Day Upskilling Plan",
  "STAR Impact Bullet Point Rewrites & Optimization"
];

const DEFAULT_NOTES_PROMPTS = [
  "Deep Synthesis & Core Concept Breakdown",
  "Generate Comprehensive Q&A & Interview Prep",
  "Cross-Reference Notes with 2026 Industry State"
];

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const savedActive = getStoredJson('cognix_active_work', null);

  const [topic, setTopic] = useState('');
  const [activeInquiry, setActiveInquiry] = useState(() => savedActive?.activeInquiry || '');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(() => savedActive?.activeTab || 'report');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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

  // Document Vault (Saved in localStorage so documents don't disappear on refresh!)
  const [documentVault, setDocumentVault] = useState(() => getStoredJson('cognix_vault', []));

  // History State
  const [history, setHistory] = useState(() => getStoredJson('cognix_history', []));

  // Agent Steps State
  const defaultSteps = {
    search: { status: 'idle', data: null, message: 'Ready to search' },
    reader: { status: 'idle', data: null, message: 'Waiting for search handoff' },
    writer: { status: 'idle', data: null, message: 'Waiting for extracted content' },
    critic: { status: 'idle', data: null, message: 'Waiting for report draft' },
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
      if (activeInquiry || finalReport || attachedFile) {
        localStorage.setItem(
          'cognix_active_work',
          JSON.stringify({
            activeInquiry,
            finalReport,
            criticFeedback,
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
  }, [activeInquiry, finalReport, criticFeedback, steps, attachedFile, fileContext, activeTab, researchMode]);

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
    setErrorMsg('');
    setSteps(defaultSteps);
    setAttachedFile(null);
    setFileContext('');
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
    setSteps({
      search: { status: 'done', data: item.search_results, message: 'Restored from history' },
      reader: { status: 'done', data: item.scraped_content, message: 'Restored from history' },
      writer: { status: 'done', data: item.report, message: 'Restored from history' },
      critic: { status: 'done', data: item.feedback, message: 'Restored from history' },
    });
    setActiveTab('report');
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

  // Trigger Research with fast SSE stream
  const handleExecuteResearch = async (overrideQuery = null) => {
    const query = (overrideQuery || topic).trim();
    if (!query || isRunning) return;

    setActiveInquiry(query);
    setTopic('');

    setErrorMsg('');
    setFinalReport('');
    setCriticFeedback('');
    setIsRunning(true);
    setActiveTab('report');

    setSteps({
      search: { status: 'running', data: null, message: 'Active: Scouting live internet & 2026 benchmarks...' },
      reader: { status: 'waiting', data: null, message: 'Waiting for Scout Agent handoff' },
      writer: { status: 'waiting', data: null, message: 'Waiting for Scholar Agent extraction' },
      critic: { status: 'waiting', data: null, message: 'Waiting for Scribe Agent synthesis' },
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

      eventSource.addEventListener('progress', (e) => {
        const payload = JSON.parse(e.data);
        const { step, status, message, data } = payload;

        setSteps((prev) => {
          const next = { ...prev };

          if (step === 'search' && status === 'done') {
            next.search = { status: 'done', data, message: 'Primary benchmarks indexed' };
            next.reader = { status: 'running', data: null, message: 'Active: Parsing DOM & mining content...' };
          } else if (step === 'reader' && status === 'done') {
            next.reader = { status: 'done', data, message: 'Deep DOM content extracted' };
            next.writer = { status: 'running', data: null, message: 'Active: Synthesizing full dossier & document analysis...' };
          } else if (step === 'writer' && status === 'done') {
            next.writer = { status: 'done', data, message: 'Comprehensive dossier generated' };
            next.critic = { status: 'running', data: null, message: 'Active: Evaluating quality & scoring...' };
            setFinalReport(data);
          } else if (step === 'critic' && status === 'done') {
            next.critic = { status: 'done', data, message: 'Audit & scoring complete' };
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
    const name = (activeInquiry || 'cognix_research').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${name}_dossier.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const extractClickableUrls = (text) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s)\]"'>]+)/g;
    const matches = text.match(urlRegex) || [];
    const unique = [...new Set(matches.map((u) => u.replace(/[.,;:]+$/, '')))];
    return unique.filter((u) => u.length > 10);
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
      title: 'Scout Agent',
      desc: 'Live Web Discovery & 2026 Standards',
      icon: Search,
    },
    {
      id: 'reader',
      num: '02',
      title: 'Scholar Agent',
      desc: 'DOM Scraping & Deep Mining',
      icon: BookOpen,
    },
    {
      id: 'writer',
      num: '03',
      title: 'Scribe Agent',
      desc: 'ATS Audit, Gap Engine & Dossier',
      icon: PenTool,
    },
    {
      id: 'critic',
      num: '04',
      title: 'Auditor Agent',
      desc: 'Objective Peer Review & Scoring',
      icon: ShieldCheck,
    },
  ];

  const searchUrls = extractClickableUrls(steps.search.data);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hidden File Input for uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.md,.json"
        className="hidden"
      />

      {/* ── Mobile Backdrop Overlay ── */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── Desktop & Mobile Responsive Sidebar ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 h-full border-r border-zinc-800/80 bg-[#0c0c10] shrink-0 transition-all duration-300 ease-in-out flex flex-col ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          isSidebarExpanded ? 'w-72 sm:w-80' : 'md:w-[72px] w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <BrandLogo className="w-8 h-8" />
            {(isSidebarExpanded || isMobileSidebarOpen) && (
              <div className="truncate">
                <span className="font-bold text-white text-sm tracking-tight block truncate">
                  Cogni<span className="text-cyan-400">X</span> <span className="text-amber-500">AI</span>
                </span>
                <p className="text-[10px] text-zinc-500 font-mono truncate">Multi-Agent Intelligence</p>
              </div>
            )}
          </div>

          {/* Sidebar internal toggle button (ONLY button on desktop) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title={isSidebarExpanded ? 'Collapse to Icon Rail' : 'Expand Sidebar'}
            >
              {isSidebarExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Collapsed Rail Mode View (Desktop Only when !isSidebarExpanded) ── */}
        {!isSidebarExpanded && (
          <div className="hidden md:flex flex-col items-center justify-between flex-1 py-4 space-y-4">
            <div className="flex flex-col items-center space-y-3 w-full">
              {/* New Research Button (Rail) */}
              <button
                onClick={startNewSession}
                className="group relative p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-90 text-black transition-all active:scale-95 shadow-sm"
                title="New Research Session"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  New Session
                </span>
              </button>

              {/* Upload PDF (Rail) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="group relative p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-cyan-400 transition-all active:scale-95"
                title="Upload Document"
              >
                {uploadingFile ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <FileUp className="w-4 h-4" />
                )}
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Upload PDF / Resume
                </span>
              </button>

              {/* Vault count pill (Rail) */}
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="group relative p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                title="Document Vault"
              >
                <Layers className="w-4 h-4" />
                {documentVault.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                    {documentVault.length}
                  </span>
                )}
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Document Vault ({documentVault.length})
                </span>
              </button>

              {/* History count pill (Rail) */}
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="group relative p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                title="Past Dossiers"
              >
                <Clock className="w-4 h-4" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-700 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {history.length}
                  </span>
                )}
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Past Dossiers ({history.length})
                </span>
              </button>

              {/* Agent Fleet info (Rail) */}
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="group relative p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                title="Agent Fleet Info"
              >
                <Cpu className="w-4 h-4" />
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Agent Pipeline (4 Agents)
                </span>
              </button>
            </div>

            {/* Bottom Rail Expand Action */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-[9px] font-mono font-bold text-cyan-400/80 uppercase">
                {researchMode[0]}
              </div>
            </div>
          </div>
        )}

        {/* ── Expanded Full Sidebar Content ── */}
        {(isSidebarExpanded || isMobileSidebarOpen) && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Primary Action Buttons */}
            <div className="p-3.5 space-y-2.5 border-b border-zinc-800/80">
              <button
                onClick={startNewSession}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-95 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                New Research Session
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-xs flex items-center justify-center gap-2 transition-all group"
              >
                {uploadingFile ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Extracting PDF Text...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                    <span>Upload PDF (Resume / Notes)</span>
                  </>
                )}
              </button>
            </div>

            {/* Document Vault Section */}
            <div className="p-3.5 border-b border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Document Vault ({documentVault.length})
                </span>
              </div>

              {documentVault.length === 0 ? (
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
                  <FileText className="w-4 h-4 text-zinc-600 mx-auto mb-1" />
                  <p className="text-[11px] text-zinc-500">No documents in vault.</p>
                  <p className="text-[10px] text-zinc-600">Upload a resume or notes PDF to attach.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {documentVault.map((doc) => {
                    const isSelected = attachedFile?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => selectVaultDoc(doc)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-cyan-500/60 bg-cyan-500/10 text-white'
                            : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate flex-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                            doc.docType === 'resume' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            {doc.docType}
                          </span>
                          <span className="truncate text-xs font-medium">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-zinc-500 font-mono">{doc.size}</span>
                          <button
                            onClick={(e) => removeVaultDoc(doc.id, e)}
                            className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Depth Selector */}
            <div className="p-3.5 border-b border-zinc-800/80">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                Agent Reasoning Depth
              </span>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {[
                  { id: 'fast', label: 'Fast Brief' },
                  { id: 'deep', label: 'Deep Dossier' },
                  { id: 'academic', label: 'Academic' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setResearchMode(m.id)}
                    className={`py-1 text-[11px] font-medium rounded transition-all ${
                      researchMode === m.id
                        ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-black font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Fleet Architecture Guide */}
            <div className="p-3.5 border-b border-zinc-800/80">
              <button
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider hover:text-cyan-400 transition-colors font-semibold"
              >
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Agent Architecture
                </span>
                {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHowItWorks && (
                <div className="mt-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 font-mono">
                  <div>
                    <strong className="text-cyan-400">01 Scout:</strong> Live internet discovery & 2026 standards.
                  </div>
                  <div>
                    <strong className="text-cyan-400">02 Scholar:</strong> DOM text extraction & verification.
                  </div>
                  <div>
                    <strong className="text-amber-400">03 Scribe:</strong> Synthesizes report + uploaded PDF.
                  </div>
                  <div>
                    <strong className="text-amber-400">04 Auditor:</strong> Automated peer review & scoring.
                  </div>
                </div>
              )}
            </div>

            {/* Recent Dossiers History */}
            <div className="flex-1 p-3.5 space-y-1 overflow-y-auto">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Recent Dossiers ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-600 font-mono">
                  No previous dossiers saved.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="group p-2 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/60 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {item.docType && (
                          <span className="text-[9px] font-mono uppercase text-amber-400 font-bold">
                            [{item.docType}]
                          </span>
                        )}
                        <p className="text-xs text-zinc-300 font-medium truncate group-hover:text-cyan-400 transition-colors">
                          {item.topic}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.date}</span>
                    </div>
                    <button
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-all"
                      title="Delete item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main App Container ── */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#09090b]">
        {/* Top Minimal Responsive Navbar (NO DUPLICATE ICONS) */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#0c0c10] shrink-0 flex items-center justify-between px-3 sm:px-6 md:px-8 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3 truncate">
            {/* Mobile menu trigger ONLY (hidden on desktop) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
              title="Open Navigation Drawer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Brand Title (Clean & uncluttered, no redundant icons) */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                Cogni<span className="text-cyan-400">X</span> <span className="text-amber-500">AI</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline pl-2 border-l border-zinc-800">
                Autonomous Multi-Agent Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Document Pill */}
            {attachedFile && (
              <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-[140px]">{attachedFile.name}</span>
                <button
                  onClick={detachCurrentFile}
                  className="hover:text-red-400 ml-0.5"
                  title="Detach File"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="hidden sm:block px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              Depth: <span className="text-cyan-400 font-bold uppercase">{researchMode}</span>
            </div>

            <button
              onClick={startNewSession}
              className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Reset Workspace"
            >
              Clear
            </button>
          </div>
        </header>

        {/* Scrollable Center Workspace */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-5xl w-full mx-auto space-y-4 sm:space-y-6">
          {/* Header & Active Inquiry Card */}
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
              {activeInquiry ? (
                <>
                  <span className="text-zinc-400 font-normal">Active Investigation:</span>
                  <span className="text-cyan-400 break-words">{activeInquiry}</span>
                </>
              ) : (
                <>
                  <span>Autonomous Multi-Agent Intelligence</span>
                </>
              )}
            </h1>
            <p className="text-xs text-zinc-400">
              Scout, Scholar, Scribe & Auditor agents collaborate to discover, extract, analyze, and review in under 10 seconds.
            </p>
          </div>

          {/* ── Main Prompt & Document Integration Workspace ── */}
          <div className="dark-card p-3 sm:p-4 space-y-3 border-zinc-700/60 bg-[#0d0d12]">
            {/* If a Document is Attached: Show Attachment Pill & Quick Actions */}
            {attachedFile ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900/90 border border-cyan-500/30">
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black uppercase">
                      {attachedFile.docType}
                    </span>
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-medium text-white truncate max-w-[150px] sm:max-w-xs">
                      {attachedFile.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                      ({attachedFile.size} • {attachedFile.charCount} chars)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready for Agent Analysis
                    </span>
                    <button
                      onClick={detachCurrentFile}
                      className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400"
                      title="Detach document"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Instant Quick-Action Analysis Presets for Attached File */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold tracking-wider">
                      One-Click Document Actions:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(attachedFile.suggestedPrompts || DEFAULT_RESUME_PROMPTS).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleExecuteResearch(p)}
                        disabled={isRunning}
                        className="text-left p-2.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group active:scale-[0.99]"
                      >
                        <span className="truncate pr-2 font-medium">{p}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Custom Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteResearch();
              }}
              className="relative"
            >
              <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 focus-within:border-cyan-500 transition-colors p-1">
                <Search className="w-4 h-4 text-zinc-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    attachedFile
                      ? `Ask anything about ${attachedFile.name} (e.g. "Evaluate my fit for Senior AI Engineer")...`
                      : "Enter research topic, technology, or upload a resume..."
                  }
                  disabled={isRunning}
                  className="w-full px-2.5 sm:px-3 py-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-xs sm:text-sm"
                />

                {!attachedFile && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile || isRunning}
                    className="p-1.5 sm:p-2 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 rounded-md transition-colors mr-1 shrink-0"
                    title="Upload PDF (Resume or Notes)"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isRunning || !topic.trim()}
                  className={`px-3 sm:px-4 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                    isRunning || !topic.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-95 text-black active:scale-95 shadow-sm'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden sm:inline">Investigating...</span>
                    </>
                  ) : (
                    <span>Execute</span>
                  )}
                </button>
              </div>
            </form>

            {!attachedFile && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Suggestions:</span>
                {SUGGESTED_TOPICS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    disabled={isRunning}
                    className="text-[11px] sm:text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded px-2.5 py-1 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* ── 4 Agent Sequential Status Pipeline ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const current = steps[agent.id];
              const isRunningStep = current.status === 'running';
              const isDoneStep = current.status === 'done';
              const isWaitingStep = current.status === 'waiting' || current.status === 'idle';

              return (
                <div
                  key={agent.id}
                  className={`dark-card p-3.5 sm:p-4 transition-all ${
                    isRunningStep
                      ? 'border-cyan-500/60 bg-[#0f141a]'
                      : isDoneStep
                      ? 'border-emerald-500/30 bg-[#0d1410]'
                      : 'opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-1.5 rounded border ${
                        isRunningStep
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                          : isDoneStep
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">{agent.num}</span>
                  </div>

                  <h3 className="font-semibold text-white text-xs sm:text-sm mb-0.5">{agent.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 mb-2 truncate">{agent.desc}</p>

                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 min-h-[36px] flex items-center">
                    <span className="line-clamp-2">{current.message}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Status:</span>
                    {isRunningStep && (
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        RUNNING
                      </span>
                    )}
                    {isDoneStep && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        DONE
                      </span>
                    )}
                    {isWaitingStep && (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Intelligence Dossier Output ── */}
          {(finalReport || isRunning) && (
            <div className="dark-card overflow-hidden">
              {/* Tabs Navigation (Responsive Horizontal Scroll) */}
              <div className="border-b border-zinc-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-[#0d0d12]">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'report'
                        ? 'bg-cyan-500 text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Investigation Dossier
                  </button>
                  <button
                    onClick={() => setActiveTab('critic')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'critic'
                        ? 'bg-emerald-500 text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Auditor Review
                  </button>
                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'sources'
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Evidence & Sources
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

              {/* Tab 1: Rendered Markdown Report */}
              {activeTab === 'report' && (
                <div className="p-4 sm:p-6 md:p-8 markdown-content min-h-[400px]">
                  {finalReport ? (
                    <div>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalReport}</ReactMarkdown>
                      <div ref={reportBottomRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-zinc-500 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                      <p className="text-xs font-mono">Synthesizing findings & document analysis into dossier...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Critic Review Scorecard */}
              {activeTab === 'critic' && (
                <div className="p-4 sm:p-6 md:p-8">
                  {criticFeedback ? (
                    <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                        <div>
                          <h4 className="font-semibold text-white text-sm">Automated Quality & ATS Readiness Audit</h4>
                          <p className="text-[11px] text-zinc-400">Evaluated independently by Auditor Agent</p>
                        </div>
                        {getScoreBadge()}
                      </div>
                      <div className="text-zinc-300 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                        {criticFeedback}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-zinc-500 space-y-2">
                      <ShieldCheck className="w-6 h-6 text-zinc-600 animate-pulse" />
                      <p className="text-xs font-mono">Awaiting report completion to run audit...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Raw Evidence & Clickable Links */}
              {activeTab === 'sources' && (
                <div className="p-4 sm:p-6 md:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                      Discovered Live Reference URLs (Clickable)
                    </h4>
                    {searchUrls.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {searchUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-xs text-cyan-300 hover:text-cyan-200 transition-colors group"
                          >
                            <span className="truncate mr-2 font-mono">{url}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 font-mono mb-4">No URLs found yet.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      1. Scout Agent Raw Search Results
                    </h4>
                    <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-60">
                      {steps.search.data || 'No search data gathered yet.'}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      2. Scholar Agent Scraped DOM Extract
                    </h4>
                    <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-60">
                      {steps.reader.data || 'No deep scraped text extracted yet.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
