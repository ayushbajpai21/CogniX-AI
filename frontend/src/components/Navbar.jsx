import React from 'react';
import { Menu, FileText, X } from 'lucide-react';

export default function Navbar({
  onOpenMobileSidebar,
  attachedFile,
  onDetachFile,
  researchMode,
  onStartNewSession
}) {
  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#0c0c10]/90 backdrop-blur-md shrink-0 flex items-center justify-between px-3 sm:px-6 md:px-8 z-20">
      <div className="flex items-center gap-2.5 sm:gap-3 truncate">
        {/* Mobile menu trigger ONLY (hidden on desktop) */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
          title="Open Navigation Drawer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand Title */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm sm:text-base tracking-tight">
            Cogni<span className="text-cyan-400">X</span> <span className="text-amber-500">AI</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline pl-2 border-l border-zinc-800">
            Autonomous Career & Job Intelligence Engine
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
              onClick={onDetachFile}
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
          onClick={onStartNewSession}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          title="Reset Workspace"
        >
          Clear
        </button>
      </div>
    </header>
  );
}
