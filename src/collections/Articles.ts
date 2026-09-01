import type { CollectionConfig } from 'payload'
import { VideoEmbed } from '../blocks/VideoEmbed'
import { slugify } from '../lib/utils'
import { revalidateTag } from 'next/cache'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reportlyfeed.com'

export const Articles: CollectionConfig = {
  slug: 'articles',
  defaultSort: '-publishedAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    description: 'News articles and investigative reports published on ReportlyFeed.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role === 'admin' || (req.user as any).role === 'editor') return true
      return { author: { equals: (req.user as any).id } }
    },
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.title) {
          const generatedSlug = slugify(data.title)
          data.slug = generatedSlug || `article-${Date.now()}`
        }
        
        if (data.content) {
          const contentStr = JSON.stringify(data.content)
          const wordCount = contentStr.split(/\s+/).length
          data.readTime = Math.max(1, Math.ceil(wordCount / 200))
        }

        // Ensure og group exists and sync fields
        if (!data.og) {
          data.og = {}
        }
        data.og.metaTitle = data.title
        data.og.metaDescription = data.excerpt
        data.og.ogImage = data.coverImage

        // Ensure meta (SEO plugin) group exists and sync fields
        if (!data.meta) {
          data.meta = {}
        }
        data.meta.title = data.title
        data.meta.description = data.excerpt
        data.meta.image = data.coverImage
        
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        if (doc.status === 'published' || previousDoc?.status === 'published') {
          try {
            revalidateTag('articles')
          } catch (e) {
            // Silently ignore when called outside Next.js request context
          }
          
          if (doc.slug) {
            const articleUrl = `${SITE_URL}/article/${doc.slug}`
            fetch(articleUrl).catch(() => {})
            fetch(`${SITE_URL}/`).catch(() => {})
          }
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left empty.',
      },
    },
    {
      name: 'aiAssistant',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/src/components/admin/AIAssistant#AIAssistant',
        },
      },
    },
    {
      name: 'shareLink',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/src/components/admin/ShareLink#ShareLink',
        },
      },
    },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 250 },
    {
      name: 'content',
      type: 'richText',
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'credit', type: 'text', admin: { description: 'News source or attribution (e.g. AP, Reuters, Reportly).' } },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'published',
      admin: { position: 'sidebar' },
    },
    { name: 'isBreaking', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', description: 'Auto-calculated' } },
    {
      name: 'og',
      label: 'OG & SEO',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
