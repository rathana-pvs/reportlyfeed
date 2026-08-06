import React from 'react'
import { Shield, FileText, Lock, Globe } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy & Terms of Service — ReportlyFeed',
  description: 'Read ReportlyFeed reader privacy policy, terms of service, whistleblower protection guidelines, and copyright policy.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-primary">
          Legal & Compliance
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary leading-tight">
          Privacy Policy & Terms
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-sans max-w-3xl">
          ReportlyFeed values reader privacy, journalistic integrity, and transparent data practices. Review our terms of use and data governance principles below.
        </p>
      </div>

      {/* Main Legal Clauses */}
      <div className="space-y-8 text-sm text-text-secondary leading-relaxed font-sans">
        {/* Clause 1 */}
        <section className="bg-bg-surface border border-border p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
            <Lock className="w-5 h-5 text-accent-primary" />
            <h2>1. Reader Privacy & Data Protection</h2>
          </div>
          <p>
            We believe that reading the news should be free from invasive tracking. ReportlyFeed does not sell personal reader information or monetize private reader profiles. 
          </p>
          <p>
            We collect minimal technical logs (such as IP address, browser user-agent, and anonymized page analytics) solely to ensure network stability, optimize site speed, and prevent security attacks.
          </p>
        </section>

        {/* Clause 2 */}
        <section className="bg-bg-surface border border-border p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
            <Shield className="w-5 h-5 text-accent-primary" />
            <h2>2. Whistleblower & Anonymous Tips Protection</h2>
          </div>
          <p>
            When confidential news tips or whistleblower files are submitted to ReportlyFeed through our contact forms or PGP channels, we scrub identifying metadata and IP logs from our server storage to guarantee source confidentiality.
          </p>
        </section>

        {/* Clause 3 */}
        <section className="bg-bg-surface border border-border p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
            <FileText className="w-5 h-5 text-accent-primary" />
            <h2>3. Intellectual Property & Syndication Rights</h2>
          </div>
          <p>
            All articles, investigative reports, original photographs, and graphics published on ReportlyFeed are protected by international copyright laws under Reportly Media Group.
          </p>
          <p>
            Brief excerpts and headlines may be quoted for academic, commentary, or news aggregation purposes under Fair Use rules provided a direct hyperlink attribution back to ReportlyFeed is included. Commercial syndication requires explicit licensing permission from <span className="text-accent-primary font-mono">editor@reportlyfeed.com</span>.
          </p>
        </section>

        {/* Clause 4 */}
        <section className="bg-bg-surface border border-border p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
            <Globe className="w-5 h-5 text-accent-primary" />
            <h2>4. Third-Party Widgets & Advertising Policy</h2>
          </div>
          <p>
            To support open digital journalism, ReportlyFeed displays curated native news widgets and advertising widgets (such as Adskeeper). These networks may use cookie tokens to serve non-intrusive contextual ads. Readers can manage cookie preferences directly in their web browser settings.
          </p>
        </section>
      </div>

      {/* Footer Timestamp */}
      <div className="text-xs font-mono text-text-muted border-t border-border pt-4 text-right">
        Last Updated: August 2026 • Editorial Standards & Compliance Desk
      </div>
    </div>
  )
}
