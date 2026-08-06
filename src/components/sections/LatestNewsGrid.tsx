import React from 'react'
import { Article } from '@/types'
import { ArticleCard } from '../ui/ArticleCard'

interface LatestNewsGridProps {
  articles: Article[]
  title?: string
}

export const LatestNewsGrid: React.FC<LatestNewsGridProps> = ({ articles, title = 'Latest Reports' }) => {
  if (!articles || articles.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
        <h2 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 bg-accent-primary rounded-sm" />
          {title}
        </h2>
        <span className="text-xs font-mono text-text-muted">Updated real-time</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((item: Article) => (
          <ArticleCard key={item.id} article={item} variant="medium" />
        ))}
      </div>
    </section>
  )
}
