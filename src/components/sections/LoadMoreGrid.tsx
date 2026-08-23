'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { ArticleCard } from '../ui/ArticleCard'
import { Loader2, ArrowDownCircle, ArrowRight } from 'lucide-react'

interface LoadMoreGridProps {
  initialArticles: Article[]
  title?: string
  totalArticles?: number
  limit?: number
}

export const LoadMoreGrid: React.FC<LoadMoreGridProps> = ({
  initialArticles,
  title = 'Latest Investigated Reports',
  totalArticles,
  limit = 8,
}) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [page, setPage] = useState<number>(2) // Next page to fetch
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(() => {
    if (totalArticles !== undefined) {
      return initialArticles.length < totalArticles
    }
    return initialArticles.length >= 6
  })
  const [error, setError] = useState<string | null>(null)

  const handleLoadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/articles?page=${page}&limit=${limit}`)
      if (!res.ok) {
        throw new Error(`Failed to load articles (${res.status})`)
      }

      const data = await res.json()
      const newArticles: Article[] = data.docs || []

      if (newArticles.length === 0) {
        setHasMore(false)
      } else {
        // Filter out any articles already in state to avoid duplicate keys
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id))
          const filtered = newArticles.filter((a) => !existingIds.has(a.id))
          return [...prev, ...filtered]
        })

        setPage((prevPage) => prevPage + 1)
        if (data.hasNextPage === false || newArticles.length < limit) {
          setHasMore(false)
        }
      }
    } catch (err: any) {
      console.error('Error loading more articles:', err)
      setError('Unable to load more articles right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!articles || articles.length === 0) return null

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
        <h2 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 bg-accent-primary rounded-sm" />
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">Updated real-time</span>
          <Link
            href="/news"
            className="text-xs font-mono font-bold text-accent-primary hover:text-accent-primary-hover hover:underline flex items-center gap-1"
          >
            All News <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((item: Article) => (
          <ArticleCard key={item.id} article={item} variant="medium" />
        ))}
      </div>

      {/* Load More Button / Indicator */}
      <div className="mt-8 flex flex-col items-center justify-center space-y-3">
        {error && (
          <p className="text-xs font-mono text-accent-breaking bg-accent-breaking/10 px-3 py-1.5 rounded">
            {error}
          </p>
        )}

        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-bg-card hover:bg-bg-hover border border-border hover:border-accent-primary/40 text-text-primary font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />
                <span>Loading Reports...</span>
              </>
            ) : (
              <>
                <ArrowDownCircle className="w-4 h-4 text-accent-primary group-hover:translate-y-0.5 transition-transform" />
                <span>Load More Reports</span>
              </>
            )}
          </button>
        ) : (
          <div className="text-center py-4 space-y-2 border-t border-border/60 w-full">
            <p className="text-xs font-mono text-text-muted">
              You’ve caught up with the latest updates.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent-primary hover:text-accent-primary-hover hover:underline"
            >
              Browse Complete News Archive <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
