import React from 'react'
import { ShieldCheck, Eye, Zap, BookOpen, Award } from 'lucide-react'

export const metadata = {
  title: 'About ReportlyFeed — Independent Global News Agency',
  description: 'Learn about ReportlyFeed editorial standards, investigative mission, and commitment to verified, independent reporting.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Hero Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-primary">
          Our Mission & Standards
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary leading-tight">
          Truth in Journalism. <br />
          Precision in Global Intelligence.
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-sans max-w-3xl">
          ReportlyFeed is an independent digital news agency and global wire service committed to delivering uncompromised investigative reporting, verified breaking news, and in-depth political and market analysis.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm hover:border-accent-primary/40 transition-colors">
          <div className="w-10 h-10 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Source Verification</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Every story published undergoes strict multi-source verification. We rely on primary documents, eyewitness accounts, and verified data sets.
          </p>
        </div>

        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm hover:border-accent-primary/40 transition-colors">
          <div className="w-10 h-10 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Editorial Independence</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            ReportlyFeed operates completely free from political affiliations or commercial influence. Our loyalty belongs strictly to public truth.
          </p>
        </div>

        <div className="bg-bg-surface border border-border p-6 rounded-lg space-y-3 shadow-sm hover:border-accent-primary/40 transition-colors">
          <div className="w-10 h-10 rounded bg-accent-primary-soft text-accent-primary flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Real-Time Speed</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Our global editorial network monitors breaking developments 24/7 to deliver fast, contextualized alerts without compromising accuracy.
          </p>
        </div>
      </div>

      {/* Detailed Editorial Policy Section */}
      <div className="bg-bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <BookOpen className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl font-black text-text-primary">Editorial Charter & Ethics</h2>
        </div>

        <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-sans">
          <p>
            ReportlyFeed adheres to rigorous AP journalistic standards, strictly separating factual news reporting from commentary and opinion.
          </p>
          
          <h4 className="font-bold text-text-primary text-base pt-2">Correction & Retraction Policy</h4>
          <p>
            Accuracy is paramount. When factual errors occur, ReportlyFeed issues prompt, transparent corrections directly on the affected article page with clear editor logs explaining the change.
          </p>

          <h4 className="font-bold text-text-primary text-base pt-2">Source Confidentiality</h4>
          <p>
            We protect confidential sources who provide whistleblower materials or background disclosures. Anonymous information is cross-referenced with secondary documentation prior to publication.
          </p>
        </div>
      </div>

      {/* Global Desk Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-accent-primary/5 border border-accent-primary/20 p-6 rounded-xl text-xs font-mono text-text-muted">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-accent-primary shrink-0" />
          <div>
            <span className="font-bold text-text-primary text-sm block">Global Press Standards Compliant</span>
            <span>Operating under international digital newsgathering protocols.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
