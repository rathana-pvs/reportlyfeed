import React from 'react'
import Link from 'next/link'
import { WhosAmungUs } from '@/components/widgets/WhosAmungUs'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white border-t border-border mt-20 text-sm">
      <div className="max-w-container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent-primary flex items-center justify-center font-black text-white text-lg">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase">
                REPORTLY<span className="text-accent-primary">FEED</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm font-sans">
              ReportlyFeed delivers verified global news, real-time breaking reporting, and objective analysis from independent journalists worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent-primary mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-gray-300">
              <li><Link href="/news" className="hover:text-accent-primary transition-colors">All News</Link></li>
              <li><Link href="/live" className="hover:text-accent-primary transition-colors">Live Wire</Link></li>
              <li><Link href="/about" className="hover:text-accent-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-accent-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-accent-primary transition-colors">Privacy & Terms</Link></li>
              <li><Link href="/admin" className="hover:text-accent-primary transition-colors">CMS Admin</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <p>© {new Date().getFullYear()} ReportlyFeed. All rights reserved. Independent Global News & Analysis.</p>
          <WhosAmungUs />
        </div>
      </div>
    </footer>
  )
}
