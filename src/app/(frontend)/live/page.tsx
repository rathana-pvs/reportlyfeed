import React from 'react'
import { getArticles } from '@/lib/api-server'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { Radio } from 'lucide-react'
import { Article } from '@/types'

export const revalidate = 30

export default async function LiveNewsPage() {
  const articles = await getArticles({ limit: 12 })

  return (
    <div className="space-y-8">
      {/* Live Banner Header */}
      <div className="bg-bg-surface border border-accent-live/30 p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-accent-live font-mono font-bold text-xs uppercase tracking-widest">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Real-Time Breaking Desk</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary">
          Live News Feed
        </h1>
        <p className="text-text-secondary text-sm">
          Chronological live updates, official press briefings, and verified breaking disclosures.
        </p>
      </div>

      {/* Live Timeline Articles */}
      <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-border">
        {articles.map((item: Article) => (
          <div key={item.id} className="relative pl-10">
            <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-accent-live border-2 border-bg-primary animate-pulse" />
            <ArticleCard article={item} variant="hero" />
          </div>
        ))}
      </div>
    </div>
  )
}
