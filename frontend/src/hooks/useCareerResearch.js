import { useState, useEffect, useRef } from 'react';
import { getStoredJson } from '../utils/storage';
import { DEFAULT_RESUME_PROMPTS, DEFAULT_NOTES_PROMPTS } from '../constants/prompts';

export function useCareerResearch() {
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

  // Agent Steps State (Simple, natural terminology)
  const defaultSteps = {
    search: { status: 'idle', data: null, message: 'Ready to find verified jobs' },
    reader: { status: 'idle', data: null, message: 'Waiting for job list' },
    writer: { status: 'idle', data: null, message: 'Waiting for skill analysis' },
    critic: { status: 'idle', data: null, message: 'Waiting for project rewrites' },
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

  // Save active work to localStorage
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
    if (window.confirm('Clear all past saved reports?')) {
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
      search: { status: 'running', data: null, message: 'Job Scout: Finding verified live jobs...' },
      reader: { status: 'waiting', data: null, message: 'Skill Analyzer on standby' },
      writer: { status: 'waiting', data: null, message: 'Project Rewriter on standby' },
      critic: { status: 'waiting', data: null, message: 'Outreach Assistant on standby' },
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
            next.search = { status: 'done', data, message: 'Verified jobs found' };
            next.reader = { status: 'running', data: null, message: 'Skill Analyzer: Checking missing skills...' };
          } else if (step === 'reader' && status === 'done') {
            next.reader = { status: 'done', data, message: 'Skill analysis complete' };
            next.writer = { status: 'running', data: null, message: 'Project Rewriter: Improving project points...' };
          } else if (step === 'writer' && status === 'done') {
            next.writer = { status: 'done', data, message: 'Project points improved' };
            next.critic = { status: 'running', data: null, message: 'Outreach Assistant: Writing cold emails...' };
            setFinalReport(data);
          } else if (step === 'critic' && status === 'done') {
            next.critic = { status: 'done', data, message: 'Outreach messages ready' };
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
    link.download = `${name}_report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    topic,
    setTopic,
    activeInquiry,
    isRunning,
    copied,
    setCopied,
    activeTab,
    setActiveTab,
    showHowItWorks,
    setShowHowItWorks,
    liveJobs,
    atsGaps,
    starRewrites,
    outreach,
    copiedEmail,
    setCopiedEmail,
    copiedDm,
    setCopiedDm,
    copiedCover,
    setCopiedCover,
    copiedJobIdx,
    setCopiedJobIdx,
    copiedBulletIdx,
    setCopiedBulletIdx,
    jobFilter,
    setJobFilter,
    isSidebarExpanded,
    setIsSidebarExpanded,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    researchMode,
    setResearchMode,
    attachedFile,
    fileContext,
    uploadingFile,
    fileInputRef,
    reportBottomRef,
    documentVault,
    history,
    steps,
    finalReport,
    criticFeedback,
    errorMsg,
    handleFileUpload,
    selectVaultDoc,
    removeVaultDoc,
    detachCurrentFile,
    startNewSession,
    loadFromHistory,
    deleteHistoryItem,
    clearAllHistory,
    handleExecuteResearch,
    copyToClipboard,
    downloadReport,
  };
}
