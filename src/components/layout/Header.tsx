'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const Header: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="bg-bg-primary border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-container mx-auto px-4">
        {/* Top Header Row */}
        <div className="h-header flex items-center justify-between gap-4">
          {/* AP News style Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-accent-primary flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-sm group-hover:bg-accent-primary-hover transition-colors">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-text-primary uppercase flex items-center">
                REPORTLY<span className="text-accent-primary font-black ml-0.5">FEED</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-text-muted tracking-widest uppercase -mt-1">
                Independent Global Wire & Analysis
              </span>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/news"
              className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors px-2.5 py-1.5 rounded hover:bg-bg-hover"
            >
              All News
            </Link>
            <Link
              href="/live"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-accent-live hover:text-accent-live/80 transition-colors px-2.5 py-1.5 rounded hover:bg-bg-hover"
            >
              <span className="w-2 h-2 rounded-full bg-accent-live animate-pulse" />
              Live
            </Link>
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded hover:bg-bg-hover border border-border text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="py-3 border-t border-border animate-fadeIn">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search breaking stories, global news, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-bg-surface border border-accent-primary rounded py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none placeholder-text-muted font-sans"
              />
              <Search className="w-4 h-4 absolute left-3.5 text-accent-primary" />
            </div>
          </form>
        )}
      </div>
    </header>
  )
}
