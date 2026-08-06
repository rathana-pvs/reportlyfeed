'use client'

import React from 'react'
import Link from 'next/link'
import { Article } from '@/types'

interface BreakingTickerProps {
  articles: Article[]
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  return (
    <div className="bg-accent-breaking text-white text-xs font-mono py-2 px-4 shadow-sm border-b border-red-900/30">
      <div className="max-w-container mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 bg-black/25 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Breaking News
        </div>
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-marquee hover:pause flex items-center gap-8">
            {articles.map((item: Article) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="hover:underline flex items-center gap-2 transition-colors text-white/90 hover:text-white"
              >
                <span className="text-white/60">•</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
