import { getPayloadClient } from './payload'
import { unstable_cache } from 'next/cache'

export interface GetArticlesOptions {
  page?: number
  limit?: number
  isBreaking?: boolean
  isFeatured?: boolean
  tag?: string
  search?: string
}

export interface PaginatedArticlesResult {
  docs: any[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const getPaginatedArticles = (options: GetArticlesOptions = {}): Promise<PaginatedArticlesResult> =>
  unstable_cache(
    async () => {
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
          page: options.page || 1,
          limit: options.limit || 20,
          sort: '-publishedAt',
          depth: 2,
          overrideAccess: true,
        })

        return JSON.parse(
          JSON.stringify({
            docs: res.docs,
            totalDocs: res.totalDocs,
            totalPages: res.totalPages,
            page: res.page || 1,
            limit: res.limit,
            hasNextPage: res.hasNextPage,
            hasPrevPage: res.hasPrevPage,
          })
        )
      } catch (err) {
        console.error('Error fetching paginated articles:', err)
        return {
          docs: [],
          totalDocs: 0,
          totalPages: 0,
          page: options.page || 1,
          limit: options.limit || 20,
          hasNextPage: false,
          hasPrevPage: false,
        }
      }
    },
    ['get-paginated-articles', JSON.stringify(options)],
    { tags: ['articles'], revalidate: 60 }
  )()

export const getArticles = async (options: GetArticlesOptions = {}) => {
  const result = await getPaginatedArticles(options)
  return result.docs
}

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
