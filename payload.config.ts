import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { 
  lexicalEditor, 
  FixedToolbarFeature, 
  HeadingFeature, 
  HorizontalRuleFeature,
  InlineCodeFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  UploadFeature,
  BlocksFeature
} from '@payloadcms/richtext-lexical'
import { VideoEmbed } from './src/blocks/VideoEmbed'
import { TwitterEmbed } from './src/blocks/TwitterEmbed'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Articles } from './src/collections/Articles'
import { Authors } from './src/collections/Authors'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { ShareLinks } from './src/collections/ShareLinks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reportlyfeed.com'

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— ReportlyFeed CMS',
    },
    theme: 'dark',
  },
  collections: [Articles, Authors, Media, Users, ShareLinks],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      FixedToolbarFeature(),
      HorizontalRuleFeature(),
      BlocksFeature({
        blocks: [VideoEmbed, TwitterEmbed],
      }),
    ],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://reportlyfeed:reportlyfeed123@localhost:5432/reportlyfeed',
    },
    push: true,
  }),
  secret: process.env.PAYLOAD_SECRET || 'reportlyfeed_secret_key_default',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['articles'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => `${doc?.title?.value || doc?.title} — ReportlyFeed`,
      generateDescription: ({ doc }: any) => doc?.excerpt?.value || doc?.excerpt,
    }),
    (config) => {
      const articlesCollection = config.collections?.find((c) => c.slug === 'articles')
      if (articlesCollection && articlesCollection.fields) {
        const ogIndex = articlesCollection.fields.findIndex((f) => 'name' in f && f.name === 'og')
        const metaIndex = articlesCollection.fields.findIndex((f) => 'name' in f && f.name === 'meta')
        
        if (ogIndex !== -1 && metaIndex !== -1) {
          const ogField = articlesCollection.fields[ogIndex]
          const metaField = articlesCollection.fields[metaIndex]
          
          articlesCollection.fields = articlesCollection.fields.filter(
            (f) => !('name' in f && (f.name === 'og' || f.name === 'meta'))
          )
          
          articlesCollection.fields.push({
            type: 'collapsible',
            label: 'Advanced (OG & SEO)',
            admin: {
              initCollapsed: true,
            },
            fields: [
              ogField,
              metaField,
            ],
          } as any)
        }
      }
      return config
    },
  ],
  cors: [
    siteUrl,
    'http://localhost:3000',
    'https://reportlyfeed.com',
    'https://www.reportlyfeed.com',
  ],
  csrf: [
    siteUrl,
    'http://localhost:3000',
    'https://reportlyfeed.com',
    'https://www.reportlyfeed.com',
  ],
})
