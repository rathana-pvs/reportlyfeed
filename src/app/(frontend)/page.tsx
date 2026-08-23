import React from 'react'
import Link from 'next/link'
import { getArticles, getPaginatedArticles } from '@/lib/api-server'
import { HeroSection } from '@/components/sections/HeroSection'
import { LoadMoreGrid } from '@/components/sections/LoadMoreGrid'
import { OpinionSection } from '@/components/sections/OpinionSection'
import { MostRead } from '@/components/sections/MostRead'
import { ArrowRight, Newspaper } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const [featuredArticles, latestPaginated] = await Promise.all([
    getArticles({ isFeatured: true, limit: 4 }),
    getPaginatedArticles({ limit: 12 }),
  ])

  const latestArticles = latestPaginated.docs
  const heroArticles = featuredArticles.length > 0 ? featuredArticles : latestArticles.slice(0, 4)
  const remainingLatest = latestArticles.slice(4)

  return (
    <div className="space-y-12">
      {/* Hero Featured Grid */}
      <HeroSection articles={heroArticles} />

      {/* Main Content Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LoadMoreGrid
            initialArticles={remainingLatest}
            title="Latest Investigated Reports"
            totalArticles={latestPaginated.totalDocs}
            limit={8}
          />
        </div>
        <div>
          <MostRead articles={latestArticles} />
        </div>
      </div>

      {/* Editorial & Opinion Section */}
      <OpinionSection articles={latestArticles.slice(0, 3)} />

      {/* Full Archive Callout */}
      <div className="bg-bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
            <Newspaper className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-text-primary">
              Looking for earlier coverage and full dispatches?
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Browse our complete chronological archive of verified investigations and breaking news.
            </p>
          </div>
        </div>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm shrink-0"
        >
          <span>View All News</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
