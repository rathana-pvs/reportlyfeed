import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPaginatedArticles } from '@/lib/api-server'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { Pagination } from '@/components/ui/Pagination'
import { Newspaper, ChevronRight } from 'lucide-react'
import { Article } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'All News & Investigative Reports — ReportlyFeed',
  description:
    'Complete chronological archive of global breaking news, independent investigative reports, and in-depth analyses.',
  openGraph: {
    title: 'All News & Reports — ReportlyFeed',
    description:
      'Complete chronological archive of global breaking news, independent investigative reports, and in-depth analyses.',
  },
}

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsArchivePage({ searchParams }: NewsPageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const limit = 18

  const { docs: articles, totalDocs, totalPages } = await getPaginatedArticles({
    page: currentPage,
    limit,
  })

  const startCount = totalDocs === 0 ? 0 : (currentPage - 1) * limit + 1
  const endCount = Math.min(currentPage * limit, totalDocs)

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Header Banner */}
      <div className="border-b border-border pb-6 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent-primary font-bold">All News</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent-primary font-mono text-xs font-bold uppercase tracking-widest">
              <Newspaper className="w-4 h-4" />
              <span>Complete News Archive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              All Investigated Reports
            </h1>
          </div>

          <div className="text-xs font-mono text-text-muted bg-bg-surface border border-border px-3 py-1.5 rounded-md self-start sm:self-auto shadow-sm">
            {totalDocs > 0 ? (
              <span>
                Showing <strong className="text-text-primary">{startCount}–{endCount}</strong> of{' '}
                <strong className="text-text-primary">{totalDocs}</strong> reports
              </span>
            ) : (
              <span>0 reports</span>
            )}
          </div>
        </div>
      </div>

      {/* Article Grid */}
      {articles && articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item: Article) => (
              <ArticleCard key={item.id} article={item} variant="medium" />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/news"
          />
        </>
      ) : (
        <div className="text-center py-16 bg-bg-surface border border-border rounded-xl space-y-3">
          <p className="text-text-primary font-bold text-lg">No articles found</p>
          <p className="text-text-muted text-sm font-mono">
            There are currently no published reports on this page.
          </p>
          <Link
            href="/news"
            className="inline-block mt-2 px-4 py-2 bg-accent-primary text-white text-xs font-mono font-bold rounded hover:bg-accent-primary-hover transition-colors"
          >
            Back to First Page
          </Link>
        </div>
      )}
    </div>
  )
}
