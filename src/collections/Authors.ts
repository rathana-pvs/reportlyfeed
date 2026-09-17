import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/utils'
import { resolveUniqueSlug } from '../lib/slug'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    description: 'ReportlyFeed journalists, editors, and contributors.',
  },
  access: {
    read: () => true,
    create: ({ req }) => (req.user as any)?.role === 'admin' || (req.user as any)?.role === 'editor',
    update: ({ req }) => (req.user as any)?.role === 'admin' || (req.user as any)?.role === 'editor',
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }) => {
        if (!data) return data
        const docId = originalDoc?.id || (data as any)?.id

        if (!data.slug && data.name) {
          const candidate = slugify(data.name) || `author-${Date.now().toString().slice(-5)}`
          data.slug = await resolveUniqueSlug({
            payload: req?.payload,
            collection: 'authors',
            candidateSlug: candidate,
            docId,
          })
        } else if (data.slug && data.slug !== originalDoc?.slug) {
          data.slug = await resolveUniqueSlug({
            payload: req?.payload,
            collection: 'authors',
            candidateSlug: data.slug,
            docId,
          })
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (!data.slug && (data.name || originalDoc?.name)) {
          const candidate = slugify(data.name || originalDoc?.name) || `author-${Date.now().toString().slice(-5)}`
          data.slug = await resolveUniqueSlug({
            payload: req?.payload,
            collection: 'authors',
            candidateSlug: candidate,
            docId: originalDoc?.id,
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'e.g. "Senior Political Correspondent"',
      },
    },
    {
      name: 'twitter',
      type: 'text',
      admin: {
        description: 'Twitter/X handle (without @)',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
}
