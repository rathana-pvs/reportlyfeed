import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export default async function ShareLinkRoute({
  params,
}: {
  params: Promise<{ slug: string; title: string }>
}) {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const shareLinkDoc = await payload.find({
      collection: 'share-links',
      where: { key: { equals: slug } },
      limit: 1,
    })

    if (shareLinkDoc.docs.length > 0) {
      const link = shareLinkDoc.docs[0] as any
      await payload.update({
        collection: 'share-links',
        id: link.id,
        data: { clicks: (link.clicks || 0) + 1 },
      })

      if (link.article && typeof link.article === 'object' && link.article.slug) {
        redirect(`/article/${link.article.slug}`)
      }
    }
  } catch (err) {
    console.warn('ShareLink redirect error:', err)
  }

  // Fallback to standard slug navigation
  redirect(`/article/${slug}`)
}
