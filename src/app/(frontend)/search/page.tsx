import React from 'react'
import { getArticles } from '@/lib/api-server'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { Search } from 'lucide-react'
import { Article } from '@/types'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>
}) {
  const { q, tag } = await searchParams
  const articles = await getArticles({ search: q, tag: tag, limit: 18 })

  const queryLabel = q ? `"${q}"` : tag ? `#${tag}` : 'All'

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6 flex items-center gap-3">
        <Search className="w-8 h-8 text-accent-primary" />
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted">
            Search Results
          </span>
          <h1 className="text-3xl font-extrabold text-text-primary">
            Showing results for {queryLabel}
          </h1>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item: Article) => (
            <ArticleCard key={item.id} article={item} variant="medium" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-surface border border-border rounded-xl space-y-2">
          <p className="text-text-primary font-bold text-lg">No articles found</p>
          <p className="text-text-muted text-sm font-mono">
            Try searching for a different keyword or topic phrase.
          </p>
        </div>
      )}
    </div>
  )
}
