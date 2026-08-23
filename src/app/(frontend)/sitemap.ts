import { MetadataRoute } from 'next'
import { getArticles } from '@/lib/api-server'
import { Article } from '@/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reportlyfeed.com'
  const articles = await getArticles({ limit: 100 })

  const articleEntries = articles.map((art: Article) => ({
    url: `${siteUrl}/article/${art.slug}`,
    lastModified: new Date(art.updatedAt || art.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    ...articleEntries,
  ]
}
