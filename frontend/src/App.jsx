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
  FileCode,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUGGESTED_TOPICS = [
  "Agentic AI Trends 2026",
  "Distributed Systems Architecture",
  "LLM Fine-tuning vs RAG in 2026",
  "Quantum Computing Error Correction"
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

export default function App() {
  const [topic, setTopic] = useState('');
  const [activeInquiry, setActiveInquiry] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'critic' | 'sources'
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Sidebar & Workspace
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [researchMode, setResearchMode] = useState('deep'); // 'fast' | 'deep' | 'academic'

  // Attached Document (Active)
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileContext, setFileContext] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Document Vault (Saved uploaded files in session)
  const [documentVault, setDocumentVault] = useState([]);

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

      const newDoc = {
        id: Date.now(),
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
    } catch (err) {
      console.error('Error uploading file:', err);
      // Fallback
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
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectVaultDoc = (doc) => {
    setAttachedFile(doc);
    setFileContext(doc.text);
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
    setSteps({
      search: { status: 'idle', data: null, message: 'Ready to search' },
      reader: { status: 'idle', data: null, message: 'Waiting for search handoff' },
      writer: { status: 'idle', data: null, message: 'Waiting for extracted content' },
      critic: { status: 'idle', data: null, message: 'Waiting for report draft' },
    });
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
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Clear all past research history?')) {
      setHistory([]);
    }
  };

  // Trigger Research with optional direct query override (for quick buttons)
  const handleExecuteResearch = async (overrideQuery = null) => {
    const query = (overrideQuery || topic).trim();
    if (!query || isRunning) return;

    // Immediately save running topic and clear input
    setActiveInquiry(query);
    setTopic('');

    setErrorMsg('');
    setFinalReport('');
    setCriticFeedback('');
    setIsRunning(true);
    setActiveTab('report');

    // Sequential agent initialization
    setSteps({
      search: { status: 'running', data: null, message: 'Active: Scanning live internet & industry benchmarks...' },
      reader: { status: 'waiting', data: null, message: 'Waiting for Scout Agent handoff' },
      writer: { status: 'waiting', data: null, message: 'Waiting for Scholar Agent extraction' },
      critic: { status: 'waiting', data: null, message: 'Waiting for Scribe Agent synthesis' },
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
            next.search = { status: 'done', data, message: 'Primary sources indexed' };
            next.reader = { status: 'running', data: null, message: 'Active: Scraping webpage text...' };
          } else if (step === 'reader' && status === 'done') {
            next.reader = { status: 'done', data, message: 'Deep DOM content extracted' };
            next.writer = { status: 'running', data: null, message: 'Active: Synthesizing dossier & document analysis...' };
          } else if (step === 'writer' && status === 'done') {
            next.writer = { status: 'done', data, message: 'Dossier report synthesized' };
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

        // Save entry to local history
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
    const name = (activeInquiry || 'research').replace(/[^a-z0-9]/gi, '_').toLowerCase();
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

    let color = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    if (scoreVal < 6) color = 'text-red-400 border-red-500/40 bg-red-950/30';
    else if (scoreVal < 8) color = 'text-amber-400 border-amber-500/40 bg-amber-950/30';

    return (
      <div className={`px-3 py-1 rounded-md border flex items-center gap-1.5 font-mono text-xs font-bold ${color}`}>
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* ── Collapsible Left Sidebar ── */}
      <aside
        className={`h-full border-r border-zinc-800/80 bg-[#0c0c10] shrink-0 transition-all duration-300 ease-in-out flex flex-col z-30 ${
          isSidebarOpen ? 'w-80 min-w-[20rem]' : 'w-0 min-w-0 overflow-hidden border-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-bold text-white text-sm tracking-tight">
                Research<span className="text-amber-500">Mind</span> AI
              </span>
              <p className="text-[10px] text-zinc-500 font-mono">Autonomous Multi-Agent System</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Primary Actions */}
        <div className="p-3.5 space-y-3 border-b border-zinc-800/80">
          <button
            onClick={startNewSession}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Research Session
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-xs flex items-center justify-center gap-2 transition-all group"
          >
            {uploadingFile ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>Extracting Text via PDF Engine...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                <span>Upload PDF (Resume / Notes / Docs)</span>
              </>
            )}
          </button>
        </div>

        {/* Document Vault Section */}
        <div className="p-3.5 border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Document Vault ({documentVault.length})
            </span>
          </div>

          {documentVault.length === 0 ? (
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
              <FileText className="w-4 h-4 text-zinc-600 mx-auto mb-1" />
              <p className="text-[11px] text-zinc-500">No documents uploaded yet.</p>
              <p className="text-[10px] text-zinc-600">Upload a resume or notes PDF to auto-attach.</p>
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
                        ? 'border-amber-500/60 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                        doc.docType === 'resume' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
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

        {/* Depth Setting */}
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
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Fleet Details */}
        <div className="p-3.5 border-b border-zinc-800/80">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider hover:text-amber-400 transition-colors font-semibold"
          >
            <span>Agent Pipeline Architecture</span>
            {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHowItWorks && (
            <div className="mt-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 font-mono">
              <div>
                <strong className="text-amber-400">01 Scout:</strong> Real-time Tavily + DDG web search.
              </div>
              <div>
                <strong className="text-amber-400">02 Scholar:</strong> DOM text extraction & verification.
              </div>
              <div>
                <strong className="text-amber-400">03 Scribe:</strong> Synthesizes report + uploaded PDF.
              </div>
              <div>
                <strong className="text-amber-400">04 Auditor:</strong> Automated review & quality score.
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
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
                className="group p-2.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/60 cursor-pointer transition-all flex items-center justify-between gap-2"
              >
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.docType && (
                      <span className="text-[9px] font-mono uppercase text-amber-400 font-bold">
                        [{item.docType}]
                      </span>
                    )}
                    <p className="text-xs text-zinc-300 font-medium truncate group-hover:text-amber-400 transition-colors">
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
      </aside>

      {/* ── Main App Container ── */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#09090b]">
        {/* Top Minimal Navbar */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#0c0c10] shrink-0 flex items-center justify-between px-4 md:px-8 z-20">
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
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Multi-Agent Intelligence Network
            </span>
          </div>

          <div className="flex items-center gap-2">
            {attachedFile && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{attachedFile.name}</span>
                <button
                  onClick={detachCurrentFile}
                  className="hover:text-red-400 ml-1"
                  title="Detach File"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              Depth: <span className="text-amber-400 font-bold uppercase">{researchMode}</span>
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
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Header & Active Inquiry Card */}
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {activeInquiry ? (
                <>
                  <span>Active Investigation:</span>
                  <span className="text-amber-500 truncate">{activeInquiry}</span>
                </>
              ) : (
                <>
                  <span>Autonomous Multi-Agent Intelligence</span>
                </>
              )}
            </h1>
            <p className="text-xs text-zinc-400">
              Scout, Scholar, Scribe & Auditor agents collaborate to discover, extract, analyze, and review.
            </p>
          </div>

          {/* ── Main Prompt & Document Integration Workspace ── */}
          <div className="dark-card p-4 space-y-3 border-zinc-700/60 bg-[#0d0d12]">
            {/* If a Document is Attached: Show Prominent Attachment Pill & Document Quick Presets */}
            {attachedFile ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900/90 border border-amber-500/30">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-black uppercase">
                      {attachedFile.docType}
                    </span>
                    <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-white truncate">{attachedFile.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ({attachedFile.size} • {attachedFile.charCount} chars)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Document Ready for Agent Analysis
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
                        className="text-left p-2.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group active:scale-[0.99]"
                      >
                        <span className="truncate pr-2 font-medium">{p}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-400 shrink-0 transition-colors" />
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
              <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 focus-within:border-amber-500 transition-colors p-1">
                <Search className="w-4 h-4 text-zinc-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    attachedFile
                      ? `Ask anything about ${attachedFile.name} (e.g. "Evaluate my fit for Senior AI Engineer")...`
                      : "Enter research topic, technology stack, or upload a resume..."
                  }
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-xs sm:text-sm"
                />

                {/* Direct File Upload button inside prompt bar if no file is attached */}
                {!attachedFile && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile || isRunning}
                    className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-md transition-colors mr-1 shrink-0"
                    title="Upload PDF (Resume or Notes)"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isRunning || !topic.trim()}
                  className={`px-4 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                    isRunning || !topic.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-black active:scale-95 shadow-sm'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Investigating...</span>
                    </>
                  ) : (
                    <span>Execute</span>
                  )}
                </button>
              </div>
            </form>

            {/* If No File: Suggest Popular Topics */}
            {!attachedFile && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Suggested Topics:</span>
                {SUGGESTED_TOPICS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    disabled={isRunning}
                    className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded px-2.5 py-1 transition-all"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                      : 'opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-1.5 rounded border ${
                        isRunningStep
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
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

          {/* ── Intelligence Dossier Output ── */}
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
                    Investigation Dossier
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
                    Auditor Review
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
                    Evidence & Live Sources
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
                      <p className="text-xs font-mono">Synthesizing findings & document analysis into dossier...</p>
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
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-2">
                      <ShieldCheck className="w-6 h-6 text-zinc-600 animate-pulse" />
                      <p className="text-xs font-mono">Awaiting report completion to run audit...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Raw Evidence & Clickable Links */}
              {activeTab === 'sources' && (
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-2 font-bold">
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
