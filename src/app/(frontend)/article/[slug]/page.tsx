import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArticleBySlug, getArticles } from '@/lib/api-server'
import { ReadingBar } from '@/components/ui/ReadingBar'
import { AdskeeperWidget } from '@/components/ads/AdskeeperWidget'
import { ArticleContent } from '@/components/article/ArticleContent'
import { getImageUrl, formatDate } from '@/lib/utils'
import { Clock } from 'lucide-react'

export async function generateStaticParams() {
  const articles = await getArticles({ limit: 40 })
  return articles.map((art: any) => ({
    slug: art.slug,
  }))
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found — ReportlyFeed' }

  return {
    title: `${article.title} — ReportlyFeed`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [getImageUrl(article.coverImage)],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const imageUrl = getImageUrl(article.coverImage)

  return (
    <>
      <ReadingBar />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-0 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article Content Column */}
          <article className="lg:col-span-8 space-y-3">
            {/* 1. Article Title & Date */}
            <header className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-snug tracking-tight my-0">
                {article.title}
              </h1>
              <div className="flex items-center gap-3 text-xs font-mono text-text-muted pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-primary" />
                  {formatDate(article.publishedAt)}
                </span>
                {article.readTime && <span>• {article.readTime} min read</span>}
              </div>
            </header>

            {/* 2. Cover Image */}
            <div className="space-y-2">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-bg-surface border border-border shadow-md">
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {article.credit && (
                <p className="text-[11px] font-mono text-text-muted text-right italic">
                  Source: {article.credit}
                </p>
              )}
            </div>

            {/* 3. Excerpt */}
            {article.excerpt && (
              <div className="border-l-4 border-accent-primary pl-4 py-3 bg-bg-surface/80 rounded-r-lg my-4">
                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-serif italic font-medium">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* 4. Article Content (p1 -> in_article_1 -> p2 -> blur -> read more -> in_article_2 -> p3 -> p4...) */}
            <ArticleContent content={article.content} excerpt={article.excerpt} />

            {/* 5. Bottom Feed / Under-Article Widget */}
            <div className="pt-4 mt-4">
              <AdskeeperWidget
                widgetId={
                  process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_UNDER_ARTICLE ||
                  process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED ||
                  '2065377'
                }
                label="Bottom Feed Ads"
              />
            </div>
          </article>

          {/* Right Side - Ads Sidebar (PC / Desktop only - zero requests on mobile) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="bg-bg-surface rounded-xl border border-border p-4 shadow-sm">
                <AdskeeperWidget
                  widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR}
                  label="Ads Sidebar"
                  className="my-2"
                  desktopOnly
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
