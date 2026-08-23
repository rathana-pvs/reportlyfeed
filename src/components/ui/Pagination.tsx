import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
  searchParams?: Record<string, string | undefined>
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath = '/news',
  searchParams = {},
}) => {
  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && key !== 'page') {
        params.set(key, val)
      }
    })
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString())
    }
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push('...')
      }
    }

    // Deduplicate consecutive ellipsis
    return pages.filter((item, index) => {
      if (item === '...' && pages[index - 1] === '...') {
        return false
      }
      return true
    })
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 sm:gap-2 my-10 select-none"
    >
      {/* Previous Page Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-border bg-bg-card hover:bg-bg-hover text-text-primary transition-colors shadow-sm"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 text-accent-primary" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-border/50 bg-bg-surface/50 text-text-muted cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronLeft className="w-4 h-4 opacity-50" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs font-mono text-text-muted"
              >
                …
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Link
              key={`page-${pageNum}`}
              href={createPageUrl(pageNum)}
              className={`min-w-[36px] h-9 flex items-center justify-center px-3 text-xs font-mono font-bold rounded-lg transition-all ${
                isActive
                  ? 'bg-accent-primary text-white shadow-sm ring-2 ring-accent-primary/30'
                  : 'bg-bg-card hover:bg-bg-hover text-text-secondary hover:text-text-primary border border-border shadow-sm'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Page Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-border bg-bg-card hover:bg-bg-hover text-text-primary transition-colors shadow-sm"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 text-accent-primary" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-border/50 bg-bg-surface/50 text-text-muted cursor-not-allowed"
          aria-disabled="true"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </span>
      )}
    </nav>
  )
}
