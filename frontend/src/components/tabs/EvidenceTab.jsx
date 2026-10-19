import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function EvidenceTab({ searchUrls = [], steps = {} }) {
  return (
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
          {steps.search?.data || 'No search data gathered yet.'}
        </pre>
      </div>

      <div>
        <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
          2. Scholar Agent Scraped DOM Extract
        </h4>
        <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-60">
          {steps.reader?.data || 'No deep scraped text extracted yet.'}
        </pre>
      </div>
    </div>
  );
}
