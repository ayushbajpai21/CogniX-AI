import React from 'react';
import { Mail, Send, MessageSquare, FileText, Copy, Check } from 'lucide-react';

export default function OutreachTab({
  outreach,
  copiedEmail,
  setCopiedEmail,
  copiedDm,
  setCopiedDm,
  copiedCover,
  setCopiedCover
}) {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            1-Click Outreach Hub (Ready to Send)
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
            High-Conversion Templates
          </span>
        </div>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Never stress over writing cold emails or recruiter DMs. Simply copy, customize placeholders, and hit send.
        </p>
      </div>

      {outreach ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Cold Email */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Personalized Cold Email to Hiring Manager
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Subject: ${outreach.cold_email_subject}\n\n${outreach.cold_email_body}`
                    );
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1 transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied Email!' : 'Copy Full Email'}</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Subject Line:</label>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200">
                  {outreach.cold_email_subject}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Email Body:</label>
                <pre className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-sans text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {outreach.cold_email_body}
                </pre>
              </div>
            </div>

            <p className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-850">
              Pro Tip: Replace [Hiring Manager Name] and [Your Name] before sending.
            </p>
          </div>

          {/* Card 2 & 3: LinkedIn InMail & Cover Note */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* LinkedIn InMail */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Recruiter LinkedIn InMail / Connection Note
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(outreach.linkedin_dm);
                    setCopiedDm(true);
                    setTimeout(() => setCopiedDm(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-mono flex items-center gap-1 transition-all"
                >
                  {copiedDm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDm ? 'Copied DM!' : 'Copy DM'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-sans text-zinc-200 leading-relaxed">
                "{outreach.linkedin_dm}"
              </div>
              <span className="text-[10px] font-mono text-zinc-500 block">
                Optimized under 300 characters to fit LinkedIn's free invitation note limit.
              </span>
            </div>

            {/* Quick Cover Note */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  150-Word Quick Cover Note
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(outreach.quick_cover_note);
                    setCopiedCover(true);
                    setTimeout(() => setCopiedCover(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1 transition-all"
                >
                  {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCover ? 'Copied Note!' : 'Copy Note'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-sans text-zinc-200 leading-relaxed">
                {outreach.quick_cover_note}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 space-y-2">
          <Mail className="w-6 h-6 animate-pulse text-zinc-600" />
          <p className="text-xs font-mono">Outreach Agent drafting tailored cold email and LinkedIn templates...</p>
        </div>
      )}
    </div>
  );
}
