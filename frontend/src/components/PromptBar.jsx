import React from 'react';
import { Search, Upload, RefreshCw, FileText, X, ArrowRight } from 'lucide-react';
import { SUGGESTED_TOPICS, DEFAULT_RESUME_PROMPTS } from '../constants/prompts';

export default function PromptBar({
  topic,
  setTopic,
  attachedFile,
  onDetachFile,
  onExecute,
  isRunning,
  uploadingFile,
  onTriggerUpload
}) {
  return (
    <div className="dark-card p-3 sm:p-4 space-y-3 border-zinc-800 bg-[#0d0d12]">
      {/* If a Document is Attached: Show Clean Attachment Banner */}
      {attachedFile && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black uppercase">
                {attachedFile.docType}
              </span>
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-medium text-white truncate max-w-[150px] sm:max-w-xs">
                {attachedFile.name}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                ({attachedFile.size})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Resume Attached
              </span>
              <button
                onClick={onDetachFile}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition-colors"
                title="Remove attached resume"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons for Attached Resume */}
          <div>
            <span className="text-xs text-zinc-400 block mb-1.5">
              Quick Actions for Your Resume:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(attachedFile.suggestedPrompts || DEFAULT_RESUME_PROMPTS).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onExecute(p)}
                  disabled={isRunning}
                  className="text-left p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-medium">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Search Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onExecute();
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
                ? `Find jobs & review skills for ${attachedFile.name} (e.g. "MERN Developer in Noida", "AI Engineer in Bengaluru")...`
                : 'Enter target job & city (e.g. "MERN Stack Developer in Noida", "React Developer in Bangalore", "AI Engineer Remote")...'
            }
            disabled={isRunning}
            className="w-full px-2.5 sm:px-3 py-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-xs sm:text-sm"
          />

          {!attachedFile && (
            <button
              type="button"
              onClick={onTriggerUpload}
              disabled={uploadingFile || isRunning}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 rounded-md transition-colors mr-1 shrink-0"
              title="Upload Resume (PDF / TXT)"
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
                : 'bg-cyan-500 hover:bg-cyan-400 text-black active:scale-95 shadow-sm'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <span>Find Jobs</span>
            )}
          </button>
        </div>
      </form>

      {!attachedFile && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-xs text-zinc-500">Quick Searches:</span>
          {SUGGESTED_TOPICS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onExecute(t)}
              disabled={isRunning}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded px-2.5 py-1 transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
