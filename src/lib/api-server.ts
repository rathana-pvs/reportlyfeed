import { getPayloadClient } from './payload'
import { unstable_cache } from 'next/cache'

export const getArticles = unstable_cache(
  async (options: {
    limit?: number
    isBreaking?: boolean
    isFeatured?: boolean
    tag?: string
    search?: string
  } = {}) => {
    try {
      const payload = await getPayloadClient()
      const where: any = {
        status: { equals: 'published' },
      }

      if (options.isBreaking !== undefined) {
        where.isBreaking = { equals: options.isBreaking }
      }

      if (options.isFeatured !== undefined) {
        where.isFeatured = { equals: options.isFeatured }
      }

      if (options.search) {
        where.or = [
          { title: { like: options.search } },
          { excerpt: { like: options.search } },
        ]
      }

      const res = await payload.find({
        collection: 'articles',
        where,
        limit: options.limit || 20,
        sort: '-publishedAt',
        depth: 2,
        overrideAccess: true,
      })

      return JSON.parse(JSON.stringify(res.docs))
    } catch (err) {
      console.error('Error fetching articles:', err)
      return []
    }
  },
  ['get-articles'],
  { tags: ['articles'], revalidate: 60 }
)

export const getArticleBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()
        const res = await payload.find({
          collection: 'articles',
          where: {
            slug: { equals: slug },
          },
          limit: 1,
          depth: 2,
          overrideAccess: true,
        })
        if (!res.docs || res.docs.length === 0) return null
        return JSON.parse(JSON.stringify(res.docs[0]))
      } catch (err) {
        console.error(`Error fetching article slug [${slug}]:`, err)
        return null
      }
    },
    ['get-article-by-slug', slug],
    { tags: ['articles'], revalidate: 60 }
  )()
