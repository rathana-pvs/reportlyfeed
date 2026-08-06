import React from 'react'
import { Mail, Lock, FileText, Send, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Contact Editorial Desk — ReportlyFeed',
  description: 'Submit confidential news tips, press releases, or contact ReportlyFeed editors and press desk.',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Page Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-primary">
          Newsroom Communications
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary leading-tight">
          Contact the Newsroom
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-sans max-w-3xl">
          Get in touch with ReportlyFeed editors, submit confidential whistleblower tips, or send press releases directly to our investigative desk.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text-primary">Encrypted Tips Desk</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            For whistleblowers and secure leaks. Submissions are end-to-end encrypted and anonymous.
          </p>
          <div className="text-[11px] font-mono text-accent-primary pt-2">
            tips@reportlyfeed.com
          </div>
        </div>

        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text-primary">Editorial Office</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            For general inquiries, press releases, story pitches, and editorial syndication rights.
          </p>
          <div className="text-[11px] font-mono text-accent-primary pt-2">
            editor@reportlyfeed.com
          </div>
        </div>

        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text-primary">Corrections & Desk</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            To report factual discrepancies, request corrections, or log fact-checking inquiries.
          </p>
          <div className="text-[11px] font-mono text-accent-primary pt-2">
            corrections@reportlyfeed.com
          </div>
        </div>
      </div>

      {/* Submission Form Section */}
      <div className="bg-bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
        <div className="space-y-2 border-b border-border pb-4">
          <h2 className="text-2xl font-black text-text-primary">Send a Message to the Desk</h2>
          <p className="text-xs text-text-secondary font-sans">
            Fill out the form below to reach our senior desk editors directly.
          </p>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Full Name / Alias
              </label>
              <input
                type="text"
                placeholder="Jane Doe or Confidential Source"
                className="w-full bg-bg-card border border-border rounded p-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full bg-bg-card border border-border rounded p-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Inquiry Type
            </label>
            <select className="w-full bg-bg-card border border-border rounded p-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary">
              <option value="tip">News Tip / Whistleblower Leak</option>
              <option value="editorial">Editorial Inquiry / Syndication</option>
              <option value="press">Press Release Submission</option>
              <option value="correction">Correction Request</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Message Details
            </label>
            <textarea
              rows={5}
              placeholder="Provide context, dates, documents, or details regarding your inquiry..."
              className="w-full bg-bg-card border border-border rounded p-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-accent-primary hover:bg-accent-primary-hover text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors shadow flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Transmit Message</span>
          </button>
        </form>
      </div>

      {/* Security Banner */}
      <div className="flex items-center gap-3 p-4 bg-bg-surface border border-border rounded-lg text-xs font-mono text-text-muted">
        <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0" />
        <span>SSL Encrypted Transmission. Your IP address is never stored with confidential news tips.</span>
      </div>
    </div>
  )
}
