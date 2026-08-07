import React from 'react'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { headers } from 'next/headers'
import { getArticleBySlug } from '@/lib/api-server'
import { getPayloadClient } from '@/lib/payload'
import { ReadingBar } from '@/components/ui/ReadingBar'
import { AdskeeperWidget } from '@/components/ads/AdskeeperWidget'
import { ArticleContent } from '@/components/article/ArticleContent'
import { getImageUrl, formatDate } from '@/lib/utils'
import { Clock } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; title: string }>
}): Promise<Metadata> {
  const { title } = await params
  const article = await getArticleBySlug(title)
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

export default async function ShareLinkArticlePage({
  params,
}: {
  params: Promise<{ slug: string; title: string }>
}) {
  const { slug: key, title: articleSlug } = await params
  let article = await getArticleBySlug(articleSlug)

  // Track click on share-links collection in background
  try {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit/i.test(userAgent)

    if (!isBot) {
      const payload = await getPayloadClient()
      const shareLinkResult = await payload.find({
        collection: 'share-links',
        where: { key: { equals: key } },
        limit: 1,
        depth: 1,
        overrideAccess: true,
      })

      if (shareLinkResult.docs.length > 0) {
        const link = shareLinkResult.docs[0] as any
        try {
          await payload.update({
            collection: 'share-links',
            id: link.id,
            data: { clicks: (link.clicks || 0) + 1 },
            overrideAccess: true,
          })
        } catch (clickErr) {
          console.warn('Failed to update share link clicks:', clickErr)
        }

        // If article wasn't found by title param, resolve it from the share-link relationship
        if (!article && link.article) {
          if (typeof link.article === 'object' && link.article.slug) {
            article = link.article
          } else if (typeof link.article === 'number' || typeof link.article === 'string') {
            try {
              const articleDoc = await payload.findByID({
                collection: 'articles',
                id: link.article,
                overrideAccess: true,
              })
              if (articleDoc) {
                article = JSON.parse(JSON.stringify(articleDoc))
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch (err) {
    console.warn('ShareLink click tracking error:', err)
  }

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

            {/* 4. Article Content */}
            <ArticleContent content={article.content} excerpt={article.excerpt} />

            {/* 5. Under Article Ads (Desktop Only) & Bottom Feed Ads */}
            <div className="pt-4 mt-4 space-y-6">
              <AdskeeperWidget
                widgetId={
                  process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_UNDER_ARTICLE ||
                  '2065383'
                }
                label="Under Article Ads"
                desktopOnly
              />
              <AdskeeperWidget
                widgetId={
                  process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED ||
                  '2065376'
                }
                label="Bottom Feed Ads"
              />
            </div>
          </article>

          {/* Right Side - Ads Sidebar (PC / Desktop only) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-20 space-y-6">
              <AdskeeperWidget
                widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR}
                label="Ads Sidebar"
                className="my-0"
                desktopOnly
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
