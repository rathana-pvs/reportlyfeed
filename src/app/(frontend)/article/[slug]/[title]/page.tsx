import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export default async function ShareLinkRoute({
  params,
}: {
  params: Promise<{ slug: string; title: string }>
}) {
  const { slug } = await params
  let targetArticleSlug: string | null = null

  try {
    const payload = await getPayloadClient()
    const shareLinkDoc = await payload.find({
      collection: 'share-links',
      where: { key: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })

    if (shareLinkDoc.docs.length > 0) {
      const link = shareLinkDoc.docs[0] as any

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

      if (link.article) {
        if (typeof link.article === 'object' && link.article.slug) {
          targetArticleSlug = link.article.slug
        } else if (typeof link.article === 'number' || typeof link.article === 'string') {
          try {
            const articleDoc = await payload.findByID({
              collection: 'articles',
              id: link.article,
              overrideAccess: true,
            })
            if (articleDoc?.slug) {
              targetArticleSlug = articleDoc.slug
            }
          } catch (e) {
            console.warn('Failed to fetch article by ID for share link:', e)
          }
        }
      }
    }
  } catch (err) {
    console.warn('ShareLink lookup error:', err)
  }

  if (targetArticleSlug) {
    redirect(`/article/${targetArticleSlug}`)
  }

  // Fallback to standard slug navigation
  redirect(`/article/${slug}`)
}

