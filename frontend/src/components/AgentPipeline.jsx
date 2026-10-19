import React from 'react';
import { RefreshCw, CheckCircle2, Lock } from 'lucide-react';

export default function AgentPipeline({ agents, steps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {agents.map((agent) => {
        const Icon = agent.icon;
        const current = steps[agent.id] || { status: 'idle', message: 'Ready' };
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
                  STANDBY
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
