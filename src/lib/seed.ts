import { getPayloadClient } from './payload'
import path from 'path'
import fs from 'fs'

async function seed() {
  console.log('🌱 Starting ReportlyFeed Database Seeding...')
  const payload = await getPayloadClient()

  if (payload.db && typeof (payload.db as any).push === 'function') {
    try {
      console.log('⚡ Synchronizing database tables...')
      await (payload.db as any).push()
    } catch (e: any) {
      console.log('DB sync notice:', e.message)
    }
  }

  // 1. Seed Admin User
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.docs.length === 0) {
    console.log('👤 Creating default Admin user...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@reportlyfeed.com',
        password: 'adminpassword123',
        name: 'Reportly Admin',
        role: 'admin',
      },
    })
  }

  // 2. Seed Default Author
  let authorId = ''
  const existingAuthors = await payload.find({ collection: 'authors', limit: 1 })
  if (existingAuthors.docs.length === 0) {
    console.log('✍️ Creating primary Editorial Staff Author...')
    const createdAuthor = await payload.create({
      collection: 'authors',
      data: {
        name: 'Reportly Editorial Board',
        slug: 'reportly-editorial-board',
        role: 'Senior Investigative Desk',
        bio: 'The investigative and core reporting division of ReportlyFeed.',
        email: 'news@reportlyfeed.com',
        twitter: 'reportlyfeed',
      },
    })
    authorId = createdAuthor.id
  } else {
    authorId = existingAuthors.docs[0].id
  }

  // 3. Seed High-Res External Press Photos
  const sampleFilePath = '/tmp/sample_cover.jpg'
  if (!fs.existsSync(sampleFilePath)) {
    fs.writeFileSync(sampleFilePath, Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'))
  }

  const mediaList = [
    {
      alt: 'Global Tech Regulation Summit',
      source: 'external',
      externalUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop',
    },
    {
      alt: 'Parliament Debates Energy Policy',
      source: 'external',
      externalUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1600&auto=format&fit=crop',
    },
    {
      alt: 'Central Bank Interest Rate Briefing',
      source: 'external',
      externalUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop',
    },
    {
      alt: 'Artificial Intelligence Innovation',
      source: 'external',
      externalUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    },
  ]

  const mediaIds: string[] = []
  for (const m of mediaList) {
    const existing = await payload.find({
      collection: 'media',
      where: { externalUrl: { equals: m.externalUrl } },
    })
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'media',
        filePath: sampleFilePath,
        data: m as any,
      })
      mediaIds.push(created.id)
    } else {
      mediaIds.push(existing.docs[0].id)
    }
  }

  // 4. Seed Sample Articles
  const sampleArticles = [
    {
      title: 'Global Economic Summit Reaches Landmark Framework on Tech Regulation',
      slug: 'global-economic-summit-reaches-landmark-framework-on-tech-regulation',
      excerpt: 'Delegates from 40 nations agree on unified standards for artificial intelligence transparency and cross-border data security.',
      coverImage: mediaIds[0] || mediaIds[1],
      isBreaking: true,
      isFeatured: true,
      credit: 'Reportly News Service',
    },
    {
      title: 'Energy Transition Policy Clears Parliament After Intensive Debate',
      slug: 'energy-transition-policy-clears-parliament-after-intensive-debate',
      excerpt: 'Lawmakers approve landmark legislation setting aggressive targets for renewable infrastructure investments.',
      coverImage: mediaIds[1] || mediaIds[0],
      isBreaking: false,
      isFeatured: true,
      credit: 'Reportly Political Desk',
    },
    {
      title: 'Central Banks Signal Pause in Rate Hikes as Inflation Stabilizes',
      slug: 'central-banks-signal-pause-in-rate-hikes-as-inflation-stabilizes',
      excerpt: 'Financial markets rally following quarterly monetary policy briefings indicating key benchmark stability.',
      coverImage: mediaIds[2] || mediaIds[0],
      isBreaking: false,
      isFeatured: false,
      credit: 'Financial Bureau',
    },
    {
      title: 'AI Language Models Reshape Modern Newsroom Operations & Fact-Checking',
      slug: 'ai-language-models-reshape-modern-newsroom-operations-and-fact-checking',
      excerpt: 'Journalists leverage advanced language algorithms to verify global datasets and speed up editorial production.',
      coverImage: mediaIds[3] || mediaIds[0],
      isBreaking: false,
      isFeatured: true,
      credit: 'Tech Investigative Desk',
    },
  ]

  for (const art of sampleArticles) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: art.slug } },
    })
    if (existing.docs.length === 0) {
      console.log(`📰 Seeding article: ${art.title}`)
      await payload.create({
        collection: 'articles',
        data: {
          ...art,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: art.excerpt }],
                },
              ],
            },
          },
          author: authorId,
          status: 'published',
          publishedAt: new Date().toISOString(),
          readTime: 3,
        },
      })
    }
  }

  console.log('✅ Seeding completed successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
