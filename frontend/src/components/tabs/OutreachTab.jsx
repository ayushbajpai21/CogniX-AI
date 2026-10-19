import React, { useState } from 'react';
import { Mail, Send, MessageSquare, FileText, Copy, Check, RefreshCw } from 'lucide-react';

export default function OutreachTab({
  outreach,
  copiedEmail,
  setCopiedEmail,
  copiedDm,
  setCopiedDm,
  copiedCover,
  setCopiedCover
}) {
  // State to toggle/reverse between different text versions
  const [emailVariant, setEmailVariant] = useState('professional'); // 'professional' | 'casual'
  const [dmVariant, setDmVariant] = useState('professional');       // 'professional' | 'casual'
  const [coverVariant, setCoverVariant] = useState('professional');   // 'professional' | 'casual'

  if (!outreach) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-2">
        <Mail className="w-5 h-5 animate-spin text-cyan-400" />
        <p className="text-xs">Generating ready-to-send outreach messages...</p>
      </div>
    );
  }

  // Active text depending on selected variant
  const currentSubject =
    emailVariant === 'casual'
      ? (outreach.cold_email_casual_subject || outreach.cold_email_subject)
      : outreach.cold_email_subject;

  const currentBody =
    emailVariant === 'casual'
      ? (outreach.cold_email_casual_body || outreach.cold_email_body)
      : outreach.cold_email_body;

  const currentDm =
    dmVariant === 'casual'
      ? (outreach.linkedin_dm_casual || outreach.linkedin_dm)
      : outreach.linkedin_dm;

  const currentCover =
    coverVariant === 'casual'
      ? (outreach.quick_cover_note_casual || outreach.quick_cover_note)
      : outreach.quick_cover_note;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            Direct Outreach Messages
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
            Ready to Send
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Copy-paste ready cold emails and LinkedIn messages. Use the <strong>Switch Version</strong> button to alternate between Professional and Casual tones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Cold Email */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Cold Email to Hiring Manager
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300">
                  {emailVariant === 'casual' ? 'Tone: Casual & Direct' : 'Tone: Professional'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Reverse / Switch Version Button */}
                <button
                  onClick={() => setEmailVariant(prev => prev === 'professional' ? 'casual' : 'professional')}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs flex items-center gap-1 transition-all"
                  title="Switch between Professional and Casual text"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{emailVariant === 'professional' ? 'Switch to Casual' : 'Revert to Professional'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${currentSubject}\n\n${currentBody}`);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Subject Line:</label>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-medium">
                {currentSubject}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Email Body:</label>
              <pre className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-sans text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {currentBody}
              </pre>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-850">
            Tip: Replace [Hiring Manager Name] and [Your Name] before sending.
          </p>
        </div>

        {/* Card 2 & 3: LinkedIn InMail & Quick Cover Note */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* LinkedIn DM */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Recruiter LinkedIn Message
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {dmVariant === 'casual' ? 'Casual' : 'Standard'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDmVariant(prev => prev === 'professional' ? 'casual' : 'professional')}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs flex items-center gap-1 transition-all"
                  title="Switch between Standard and Casual DM"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{dmVariant === 'professional' ? 'Switch to Casual' : 'Revert'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentDm);
                    setCopiedDm(true);
                    setTimeout(() => setCopiedDm(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  {copiedDm ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDm ? 'Copied!' : 'Copy DM'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
              "{currentDm}"
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Under 300 characters to fit LinkedIn's free invitation connection note limit.
            </span>
          </div>

          {/* Quick Cover Note */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Quick Cover Note (150 Words)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCoverVariant(prev => prev === 'professional' ? 'casual' : 'professional')}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{coverVariant === 'professional' ? 'Switch' : 'Revert'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentCover);
                    setCopiedCover(true);
                    setTimeout(() => setCopiedCover(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  {copiedCover ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCover ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
              {currentCover}
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Direct copy-paste for online career portal application forms.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
