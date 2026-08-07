import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { getImageUrl, formatTimeAgo } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'medium' | 'compact'
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'medium' }) => {
  const imageUrl = getImageUrl(article.coverImage, article.slug)

  if (variant === 'hero') {
    return (
      <article className="group relative bg-bg-card border border-border hover:border-accent-primary/40 rounded-lg overflow-hidden shadow-sm transition-all duration-300 flex flex-col lg:flex-row">
        <Link href={`/article/${article.slug}`} className="lg:w-3/5 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-bg-surface block">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          {article.isBreaking && (
            <div className="absolute top-4 left-4 bg-accent-breaking text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded shadow animate-pulse">
              🚨 Breaking News
            </div>
          )}
        </Link>
        <div className="lg:w-2/5 p-6 lg:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-text-primary group-hover:text-accent-primary transition-colors leading-tight tracking-tight">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base line-clamp-3 leading-relaxed font-serif italic border-l-2 border-accent-primary/50 pl-3.5 my-1">
              {article.excerpt}
            </p>
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
              <Clock className="w-3 h-3 text-accent-primary" />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
            {article.readTime && (
              <span className="text-[11px] font-mono text-text-muted">{article.readTime} min read</span>
            )}
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 p-3.5 bg-bg-card hover:bg-bg-hover border border-border rounded-lg transition-colors shadow-sm">
        <Link href={`/article/${article.slug}`} className="w-24 h-24 shrink-0 relative rounded overflow-hidden bg-bg-surface block">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h4 className="text-sm font-extrabold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 mt-1 leading-snug">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h4>
          </div>
          <div className="text-[10px] font-mono text-text-muted flex items-center gap-2 mt-2">
            <span>{formatTimeAgo(article.publishedAt)}</span>
            {article.readTime && <span>• {article.readTime} min read</span>}
          </div>
        </div>
      </article>
    )
  }

  // Medium Card (Default Grid Variant)
  return (
    <article className="group bg-bg-card border border-border hover:border-accent-primary/40 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link href={`/article/${article.slug}`} className="relative h-48 w-full overflow-hidden bg-bg-surface block">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {article.isBreaking && (
          <div className="absolute top-3 left-3 bg-accent-breaking text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
            Breaking
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 leading-snug tracking-tight">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="text-[10px] font-mono text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-accent-primary" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
          {article.readTime && (
            <span className="text-[10px] font-mono text-text-muted">{article.readTime} min read</span>
          )}
        </div>
      </div>
    </article>
  )
}
