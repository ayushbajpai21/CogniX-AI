import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefreshCw } from 'lucide-react';

export default function DossierTab({ finalReport, reportBottomRef }) {
  return (
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
  );
}
