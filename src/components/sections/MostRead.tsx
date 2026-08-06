import React from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { TrendingUp } from 'lucide-react'

interface MostReadProps {
  articles: Article[]
}

export const MostRead: React.FC<MostReadProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <TrendingUp className="w-4 h-4 text-accent-primary" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">
          Most Read Stories
        </h3>
      </div>

      <div className="space-y-4 divide-y divide-border">
        {articles.slice(0, 5).map((item: Article, index: number) => (
          <div key={item.id} className="pt-3 first:pt-0 flex gap-3 group">
            <span className="text-2xl font-black font-sans text-accent-primary group-hover:text-accent-primary-hover transition-colors">
              0{index + 1}
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-text-primary group-hover:text-accent-primary transition-colors leading-snug line-clamp-2">
                <Link href={`/article/${item.slug}`}>
                  {item.title}
                </Link>
              </h4>
              <span className="text-[10px] font-mono text-text-muted">
                {item.readTime || 3} min read
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
