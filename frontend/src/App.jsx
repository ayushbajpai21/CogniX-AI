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
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUGGESTED_TOPICS = [
  "Agentic AI Trends 2026",
  "Next.js 15 vs Remix Comparison",
  "Solid State Battery Breakthroughs",
  "Quantum Computing Error Correction"
];

export default function App() {
  const [topic, setTopic] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'critic' | 'sources'
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Sidebar States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [researchMode, setResearchMode] = useState('deep'); // 'fast' | 'deep' | 'academic'
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileContext, setFileContext] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('researchmind_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Agent Steps State
  const [steps, setSteps] = useState({
    search: { status: 'idle', data: null, message: 'Ready to search' },
    reader: { status: 'idle', data: null, message: 'Waiting for search handoff' },
    writer: { status: 'idle', data: null, message: 'Waiting for extracted content' },
    critic: { status: 'idle', data: null, message: 'Waiting for report draft' },
  });

  const [finalReport, setFinalReport] = useState('');
  const [criticFeedback, setCriticFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('researchmind_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

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

      setFileContext(data.text || '');
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        charCount: data.char_count || 0,
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      // Client-side text fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContext(event.target.result || '');
        setAttachedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
        });
      };
      reader.readAsText(file);
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setFileContext('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startNewResearch = () => {
    setTopic('');
    setCurrentTopic('');
    setFinalReport('');
    setCriticFeedback('');
    setErrorMsg('');
    setSteps({
      search: { status: 'idle', data: null, message: 'Ready to search' },
      reader: { status: 'idle', data: null, message: 'Waiting for search handoff' },
      writer: { status: 'idle', data: null, message: 'Waiting for extracted content' },
      critic: { status: 'idle', data: null, message: 'Waiting for report draft' },
    });
  };

  const loadFromHistory = (item) => {
    setTopic('');
    setCurrentTopic(item.topic);
    setFinalReport(item.report);
    setCriticFeedback(item.feedback);
    setSteps({
      search: { status: 'done', data: item.search_results, message: 'Restored from history' },
      reader: { status: 'done', data: item.scraped_content, message: 'Restored from history' },
      writer: { status: 'done', data: item.report, message: 'Restored from history' },
      critic: { status: 'done', data: item.feedback, message: 'Restored from history' },
    });
    setActiveTab('report');
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Clear all research history?')) {
      setHistory([]);
    }
  };

  const handleStartResearch = async (e) => {
    if (e) e.preventDefault();
    const query = topic.trim();
    if (!query || isRunning) return;

    // Save and clear input immediately
    setCurrentTopic(query);
    setTopic('');

    setErrorMsg('');
    setFinalReport('');
    setCriticFeedback('');
    setIsRunning(true);
    setActiveTab('report');

    // Sequential initialization
    setSteps({
      search: { status: 'running', data: null, message: 'Active: Scanning live internet for sources...' },
      reader: { status: 'waiting', data: null, message: 'Waiting for Step 1 handoff signal' },
      writer: { status: 'waiting', data: null, message: 'Waiting for Step 2 handoff signal' },
      critic: { status: 'waiting', data: null, message: 'Waiting for Step 3 handoff signal' },
    });

    try {
      const url = `/api/research/stream?topic=${encodeURIComponent(query)}&context=${encodeURIComponent(fileContext)}`;
      const eventSource = new EventSource(url);

      eventSource.addEventListener('progress', (e) => {
        const payload = JSON.parse(e.data);
        const { step, status, message, data } = payload;

        setSteps((prev) => {
          const next = { ...prev };

          if (step === 'search' && status === 'done') {
            next.search = { status: 'done', data, message: 'Sources discovered & indexed' };
            next.reader = { status: 'running', data: null, message: 'Active: Scraping webpage text...' };
          } else if (step === 'reader' && status === 'done') {
            next.reader = { status: 'done', data, message: 'Deep DOM content extracted' };
            next.writer = { status: 'running', data: null, message: 'Active: Synthesizing multi-section report...' };
          } else if (step === 'writer' && status === 'done') {
            next.writer = { status: 'done', data, message: 'Report draft generated' };
            next.critic = { status: 'running', data: null, message: 'Active: Evaluating quality & score...' };
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

        // Save entry to local history
        const newEntry = {
          id: Date.now(),
          topic: query,
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
    const name = (currentTopic || 'research').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${name}_report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper: Extract valid clickable URLs from search text
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

    let color = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (scoreVal < 6) color = 'text-red-400 border-red-500/40 bg-red-950/20';
    else if (scoreVal < 8) color = 'text-amber-400 border-amber-500/40 bg-amber-950/20';

    return (
      <div className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs font-bold ${color}`}>
        <span>SCORE:</span>
        <span className="text-base">{scoreVal}/10</span>
      </div>
    );
  };

  const agents = [
    {
      id: 'search',
      num: '01',
      title: 'Scout Agent',
      desc: 'Live Web Discovery',
      icon: Search,
    },
    {
      id: 'reader',
      num: '02',
      title: 'Scholar Agent',
      desc: 'Deep Page Extraction',
      icon: BookOpen,
    },
    {
      id: 'writer',
      num: '03',
      title: 'Scribe Agent',
      desc: 'Analytical Synthesis',
      icon: PenTool,
    },
    {
      id: 'critic',
      num: '04',
      title: 'Auditor Agent',
      desc: 'Peer Audit & Scoring',
      icon: ShieldCheck,
    },
  ];

  const searchUrls = extractClickableUrls(steps.search.data);
  const readerUrls = extractClickableUrls(steps.reader.data);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans">
      {/* ── Minimalist Sidebar ── */}
      <aside
        className={`h-full border-r border-zinc-800 bg-[#0c0c10] shrink-0 transition-all duration-300 ease-in-out flex flex-col z-30 ${
          isSidebarOpen ? 'w-72 min-w-[18rem]' : 'w-0 min-w-0 overflow-hidden border-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="font-bold text-white text-base tracking-tight">
              Research<span className="text-amber-500">Mind</span>
            </span>
            <p className="text-[11px] text-zinc-500">Autonomous Research System</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-3.5 space-y-2 border-b border-zinc-800">
          <button
            onClick={startNewResearch}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Investigation
          </button>

          {/* Context File Attachment (PDF / Document) */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md,.json"
              className="hidden"
            />
            {attachedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-zinc-200 truncate">{attachedFile.name}</span>
                  <span className="text-[10px] text-zinc-500 shrink-0">({attachedFile.size})</span>
                </div>
                <button
                  onClick={removeAttachedFile}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs flex items-center justify-center gap-2 transition-all"
              >
                {uploadingFile ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>Parsing Document...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Attach PDF / Resume / Document</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-3.5 border-b border-zinc-800">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
            Investigation Depth
          </span>
          <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {[
              { id: 'fast', label: 'Fast' },
              { id: 'deep', label: 'Deep' },
              { id: 'academic', label: 'Paper' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setResearchMode(m.id)}
                className={`py-1 text-[11px] font-medium rounded transition-all ${
                  researchMode === m.id
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Purpose / Architecture Guide */}
        <div className="p-3.5 border-b border-zinc-800">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider hover:text-amber-400 transition-colors"
          >
            <span>How Agents Work</span>
            {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHowItWorks && (
            <div className="mt-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-2">
              <div>
                <strong className="text-amber-400">1. Scout Agent:</strong> Discovers live web sources.
              </div>
              <div>
                <strong className="text-amber-400">2. Scholar Agent:</strong> Extracts clean text from target page.
              </div>
              <div>
                <strong className="text-amber-400">3. Scribe Agent:</strong> Synthesizes findings + uploaded PDF.
              </div>
              <div>
                <strong className="text-amber-400">4. Auditor Agent:</strong> Audits factual clarity & issues score.
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Past Investigations ({history.length})
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
            <div className="text-center py-8 text-xs text-zinc-600 font-mono">
              No previous investigations saved.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="group p-2.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/60 cursor-pointer transition-all flex items-center justify-between gap-2"
              >
                <div className="truncate flex-1">
                  <p className="text-xs text-zinc-300 font-medium truncate group-hover:text-amber-400 transition-colors">
                    {item.topic}
                  </p>
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
      </aside>

      {/* ── Main App Container ── */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#09090b]">
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-800 bg-[#0c0c10] shrink-0 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                title="Open Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-mono text-zinc-400">Autonomous Investigation Pipeline</span>
          </div>

          <div className="flex items-center gap-2">
            {attachedFile && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{attachedFile.name}</span>
              </div>
            )}
            <div className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              Depth: <span className="text-amber-400 font-bold uppercase">{researchMode}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Center View */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Header & Active Topic Indicator */}
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {currentTopic ? (
                <span>
                  Investigation: <span className="text-amber-500">{currentTopic}</span>
                </span>
              ) : (
                'Autonomous Research System'
              )}
            </h1>
            <p className="text-xs text-zinc-400">
              Four specialized agents execute structured discovery, extraction, synthesis, and audit.
            </p>
          </div>

          {/* Search Input Bar (Clears on Submit) */}
          <div>
            <form onSubmit={handleStartResearch} className="relative">
              <div className="relative flex items-center dark-card p-1 focus-within:border-amber-500 transition-all">
                <Search className="w-4 h-4 text-zinc-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={currentTopic ? "Start another investigation..." : "Enter research topic..."}
                  disabled={isRunning}
                  className="w-full px-3 py-2.5 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={isRunning || !topic.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                    isRunning || !topic.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-black active:scale-95'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Execute</span>
                  )}
                </button>
              </div>
            </form>

            {/* Suggested Pills */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Suggestions:</span>
              {SUGGESTED_TOPICS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(t)}
                  disabled={isRunning}
                  className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded px-2 py-0.5 transition-all"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* ── 4 Agent Minimalist Sequential Flow Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const current = steps[agent.id];
              const isRunningStep = current.status === 'running';
              const isDoneStep = current.status === 'done';
              const isWaitingStep = current.status === 'waiting' || current.status === 'idle';

              return (
                <div
                  key={agent.id}
                  className={`dark-card p-4 transition-all ${
                    isRunningStep
                      ? 'dark-card-active'
                      : isDoneStep
                      ? 'border-emerald-500/30 bg-[#0d1410]'
                      : 'opacity-65'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-1.5 rounded border ${
                        isRunningStep
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : isDoneStep
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">{agent.num}</span>
                  </div>

                  <h3 className="font-semibold text-white text-sm mb-0.5">{agent.title}</h3>
                  <p className="text-[11px] text-zinc-400 mb-2.5">{agent.desc}</p>

                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 min-h-[38px] flex items-center">
                    <span className="line-clamp-2">{current.message}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Status:</span>
                    {isRunningStep && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        PROCESSING
                      </span>
                    )}
                    {isDoneStep && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        COMPLETED
                      </span>
                    )}
                    {isWaitingStep && (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        WAITING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Output Dashboard ── */}
          {(finalReport || isRunning) && (
            <div className="dark-card overflow-hidden">
              {/* Tabs Navigation */}
              <div className="border-b border-zinc-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#0d0d12]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'report'
                        ? 'bg-amber-500 text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Investigation Report
                  </button>
                  <button
                    onClick={() => setActiveTab('critic')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'critic'
                        ? 'bg-emerald-500 text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Critic Audit
                  </button>
                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'sources'
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Raw Evidence & Links
                  </button>
                </div>

                {/* Score badge & utilities */}
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
                        <Download className="w-3.5 h-3.5 text-amber-500" />
                        <span>Export .md</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tab 1: Rendered Markdown Report */}
              {activeTab === 'report' && (
                <div className="p-6 md:p-8 markdown-content">
                  {finalReport ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalReport}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                      <p className="text-xs font-mono">Synthesizing findings into structured report...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Critic Review Scorecard */}
              {activeTab === 'critic' && (
                <div className="p-6 md:p-8">
                  {criticFeedback ? (
                    <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                          <h4 className="font-semibold text-white text-sm">Autonomous Quality Audit</h4>
                          <p className="text-[11px] text-zinc-400">Evaluated by Independent Reviewer Chain</p>
                        </div>
                        {getScoreBadge()}
                      </div>
                      <div className="text-zinc-300 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                        {criticFeedback}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-2">
                      <ShieldCheck className="w-6 h-6 text-zinc-600 animate-pulse" />
                      <p className="text-xs font-mono">Awaiting report completion to run audit...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Raw Evidence & Real Clickable Links */}
              {activeTab === 'sources' && (
                <div className="p-6 md:p-8 space-y-6">
                  {/* Clickable Discovered URLs */}
                  <div>
                    <h4 className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-2 font-bold">
                      Discovered Reference URLs (Clickable)
                    </h4>
                    {searchUrls.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {searchUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-xs text-amber-400 hover:text-amber-300 transition-colors group"
                          >
                            <span className="truncate mr-2 font-mono">{url}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 font-mono mb-4">No URLs found yet.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      1. Search Agent Raw Text Findings
                    </h4>
                    <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-60">
                      {steps.search.data || 'No search data gathered yet.'}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      2. Reader Agent Scraped Extract
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
