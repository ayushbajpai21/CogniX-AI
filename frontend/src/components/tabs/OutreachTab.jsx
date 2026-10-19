import React, { useState } from 'react';
import { Mail, Send, MessageSquare, FileText, Copy, Check, Sparkles, Building2, Rocket, GraduationCap, Code2, Clock } from 'lucide-react';

const ICONS = {
  professional: Building2,
  startup: Rocket,
  fresher: GraduationCap,
  technical: Code2,
  followup: Clock,
  linkedin_dm: MessageSquare,
};

export default function OutreachTab({
  outreach,
  copiedEmail,
  setCopiedEmail,
  copiedDm,
  setCopiedDm,
  copiedCover,
  setCopiedCover
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedSubject, setCopiedSubject] = useState(false);

  if (!outreach) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-2">
        <Mail className="w-5 h-5 animate-spin text-cyan-400" />
        <p className="text-xs">Generating 6 customized outreach message styles...</p>
      </div>
    );
  }

  // Construct templates safely if loaded from old cache or fresh stream
  const templates = outreach.templates && outreach.templates.length > 0
    ? outreach.templates
    : [
        {
          id: 'professional',
          name: 'Professional & Formal',
          badge: 'MNC & Corporate',
          best_for: 'Enterprise MNCs, Corporate Recruiters, and Traditional HR Portals.',
          subject: outreach.cold_email_subject || 'Application: Software Developer — [Your Name]',
          body: outreach.cold_email_body || 'Dear [Hiring Manager Name],\n\nI am writing to express my strong interest in the Software Developer position...'
        },
        {
          id: 'startup',
          name: 'Startup Founder Pitch',
          badge: 'Startups & CTOs',
          best_for: 'Early-Stage & Unicorn Startups, Founders, and CTOs who value high agency.',
          subject: outreach.cold_email_casual_subject || 'Quick note regarding developer opening at [Company Name]',
          body: outreach.cold_email_casual_body || "Hi [Founder / Tech Lead Name],\n\nHope you're having an awesome week! I've been closely tracking what [Company Name] is building..."
        },
        {
          id: 'fresher',
          name: 'Fresher / Fast Learner',
          badge: 'Freshers & Trainees',
          best_for: 'College Graduates, Freshers (0-1 yr), Trainees, and Career Switchers.',
          subject: 'Aspiring Developer | Eager Early-Career Engineer for [Company Name]',
          body: 'Dear [Hiring Team / Recruiter Name],\n\nI am an enthusiastic software developer actively seeking an entry-level opening at [Company Name]...'
        },
        {
          id: 'technical',
          name: 'Technical Architecture',
          badge: 'Tech Leads & EMs',
          best_for: 'Engineering Managers, Staff Engineers, and Senior Tech Leads.',
          subject: 'Software Developer Candidate: Technical architecture & live project demo',
          body: 'Hi [Engineering Lead Name],\n\nI wanted to reach out regarding the developer role at [Company Name]. Rather than just sending a resume, here is a quick technical overview of my recent work...'
        },
        {
          id: 'followup',
          name: 'Post-Application Follow-Up',
          badge: 'Application Check-In',
          best_for: 'Send 3 to 5 business days after applying on LinkedIn, Naukri, or Careers Portal.',
          subject: 'Following up on application for Developer — [Your Name]',
          body: 'Hi [Hiring Manager / Recruiter Name],\n\nI recently submitted my application for the developer position via your careers portal...'
        },
        {
          id: 'linkedin_dm',
          name: 'Recruiter LinkedIn InMail',
          badge: 'LinkedIn InMail (<300 chars)',
          best_for: 'Short, high-conversion message under 300 characters for LinkedIn connections or InMail.',
          subject: 'LinkedIn Direct Message',
          body: outreach.linkedin_dm || 'Hi [Name], I noticed you are hiring for developer roles at [Company]. I build full-stack web applications and clean APIs. Would love to connect!'
        }
      ];

  const activeTemplate = templates[selectedIdx] || templates[0];
  const IconComponent = ICONS[activeTemplate.id] || Mail;

  const copySubjectOnly = () => {
    navigator.clipboard.writeText(activeTemplate.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const copyFullMessage = () => {
    const textToCopy =
      activeTemplate.id === 'linkedin_dm'
        ? activeTemplate.body
        : `Subject: ${activeTemplate.subject}\n\n${activeTemplate.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const quickCover = outreach.quick_cover_note || "Dedicated software developer with hands-on experience building full-stack web applications and modern APIs. Excited to contribute immediately to the team.";
  const linkedinDmText = outreach.linkedin_dm || activeTemplate.body;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            Direct Outreach Messages
          </h3>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono">
            6 Specialized Styles
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Select any outreach style below to tailor your message for MNCs, Startup Founders, Tech Leads, or LinkedIn recruiters. 1-click copy-paste ready.
        </p>
      </div>

      {/* Style Selector Tabs (6 Options) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {templates.map((tmpl, idx) => {
          const TabIcon = ICONS[tmpl.id] || Send;
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={tmpl.id || idx}
              onClick={() => setSelectedIdx(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 border-cyan-500 shadow-sm shadow-cyan-500/10'
                  : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
              </div>
              <span className={`text-xs font-semibold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                {tmpl.name}
              </span>
              <span className="text-[10px] text-zinc-400 line-clamp-1 font-mono">
                {tmpl.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Active Pitch Card & Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): Active Chosen Outreach Message */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Title & Copy Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">
                  {activeTemplate.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300">
                  {activeTemplate.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeTemplate.subject && activeTemplate.id !== 'linkedin_dm' && (
                  <button
                    onClick={copySubjectOnly}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 text-xs flex items-center gap-1 transition-all"
                    title="Copy only subject line"
                  >
                    {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSubject ? 'Subject Copied' : 'Copy Subject'}</span>
                  </button>
                )}

                <button
                  onClick={copyFullMessage}
                  className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Full Message'}</span>
                </button>
              </div>
            </div>

            {/* Best For Info Banner */}
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white">Best For: </strong>
                {activeTemplate.best_for}
              </span>
            </div>

            {/* Subject Line (if not LinkedIn DM) */}
            {activeTemplate.subject && activeTemplate.id !== 'linkedin_dm' && (
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Subject Line:
                </label>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-medium select-all">
                  {activeTemplate.subject}
                </div>
              </div>
            )}

            {/* Message Body */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                Message Body:
              </label>
              <pre className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-sans text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-all">
                {activeTemplate.body}
              </pre>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-850 flex items-center justify-between">
            <span>Replace placeholder items inside [Brackets] before hitting send.</span>
            <span className="font-mono text-zinc-400">Option {selectedIdx + 1} of 6</span>
          </div>
        </div>

        {/* Right Column (1 Col): LinkedIn InMail & Quick Cover Note */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* LinkedIn DM Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Recruiter LinkedIn InMail
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(linkedinDmText);
                  setCopiedDm(true);
                  setTimeout(() => setCopiedDm(false), 2000);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs flex items-center gap-1 transition-all"
              >
                {copiedDm ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDm ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
              "{linkedinDmText}"
            </div>
            <span className="text-[11px] text-zinc-500 block">
              Under 300 characters to fit LinkedIn's free invitation connection note limit.
            </span>
          </div>

          {/* Quick Cover Note Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Quick Portal Cover Note
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(quickCover);
                  setCopiedCover(true);
                  setTimeout(() => setCopiedCover(false), 2000);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs flex items-center gap-1 transition-all"
              >
                {copiedCover ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCover ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
              {quickCover}
            </div>
            <span className="text-[11px] text-zinc-500 block">
              Direct copy-paste for online career portal application textboxes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
