import React from 'react';
import {
  Plus,
  Upload,
  RefreshCw,
  FileUp,
  Layers,
  Clock,
  Cpu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  FileText,
  Trash2
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Sidebar({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onStartNewSession,
  onTriggerUpload,
  uploadingFile,
  documentVault,
  onSelectVaultDoc,
  onRemoveVaultDoc,
  attachedFile,
  researchMode,
  setResearchMode,
  showHowItWorks,
  setShowHowItWorks,
  history,
  onLoadFromHistory,
  onDeleteHistoryItem,
  onClearAllHistory
}) {
  return (
    <>
      {/* ── Mobile Backdrop Overlay ── */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── Desktop & Mobile Responsive Sidebar ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 h-full border-r border-zinc-800/80 bg-[#0c0c10]/95 backdrop-blur-md shrink-0 transition-all duration-300 ease-in-out flex flex-col ${
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
                <p className="text-[10px] text-zinc-500 font-mono truncate">Career & Job Intelligence</p>
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
              {/* New Career Search Button (Rail) */}
              <button
                onClick={onStartNewSession}
                className="group relative p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-90 text-black transition-all active:scale-95 shadow-sm"
                title="New Career Inquiry"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  New Career Inquiry
                </span>
              </button>

              {/* Upload PDF (Rail) */}
              <button
                onClick={onTriggerUpload}
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
                title="Saved Reports"
              >
                <Clock className="w-4 h-4" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-700 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {history.length}
                  </span>
                )}
                <span className="absolute left-full ml-2.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Saved Reports ({history.length})
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
                  LangGraph Agent Pipeline (4 Agents)
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
                onClick={onStartNewSession}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 hover:opacity-95 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                New Career Inquiry
              </button>

              <button
                onClick={onTriggerUpload}
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
                    <span>Upload Resume / Notes (PDF)</span>
                  </>
                )}
              </button>
            </div>

            {/* Document Vault (Saved across sessions) */}
            <div className="p-3.5 border-b border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Document Vault ({documentVault.length})
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Persistent</span>
              </div>

              {documentVault.length === 0 ? (
                <div className="p-3 rounded-lg border border-dashed border-zinc-800 text-center text-xs text-zinc-500 font-mono">
                  No documents in vault.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {documentVault.map((doc) => {
                    const isAttached = attachedFile?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => onSelectVaultDoc(doc)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                          isAttached
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                            : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div className="truncate flex items-center gap-2">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isAttached ? 'text-cyan-400' : 'text-zinc-500'}`} />
                          <div className="truncate">
                            <span className="block truncate font-medium">{doc.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {doc.docType.toUpperCase()} • {doc.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isAttached && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-400 text-black font-bold">
                              Active
                            </span>
                          )}
                          <button
                            onClick={(e) => onRemoveVaultDoc(doc.id, e)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
                            title="Remove from vault"
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
            <div className="p-3.5 border-b border-zinc-800/80 space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Investigation Mode
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                {[
                  { id: 'fast', label: 'Fast (10s)' },
                  { id: 'deep', label: 'Deep ATS' },
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
                  LangGraph Fleet (4 Agents)
                </span>
                {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHowItWorks && (
                <div className="mt-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 font-mono">
                  <div>
                    <strong className="text-cyan-400">01 Job Scout:</strong> Direct career portal & live apply link mining.
                  </div>
                  <div>
                    <strong className="text-cyan-400">02 ATS Gap:</strong> 2026 hiring filters & missing keywords.
                  </div>
                  <div>
                    <strong className="text-amber-400">03 STAR Rewriter:</strong> 1-Click metrics-driven project bullets.
                  </div>
                  <div>
                    <strong className="text-purple-400">04 Outreach:</strong> Personalized Cold Emails & LinkedIn DMs.
                  </div>
                </div>
              )}
            </div>

            {/* Recent Dossiers History */}
            <div className="flex-1 p-3.5 space-y-1 overflow-y-auto">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Recent Inquiries ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    onClick={onClearAllHistory}
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-600 font-mono">
                  No previous inquiries saved.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onLoadFromHistory(item)}
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
                      onClick={(e) => onDeleteHistoryItem(item.id, e)}
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
    </>
  );
}
