import { getPayloadClient } from './payload'
import fs from 'fs'
import path from 'path'

async function importPulefeedArticles() {
  console.log('📦 Starting Pulefeed Articles Import for ReportlyFeed...')
  const payload = await getPayloadClient()

  const dataPath = path.resolve(process.cwd(), 'pulefeed_data.json')
  if (!fs.existsSync(dataPath)) {
    console.error('❌ pulefeed_data.json not found!')
    process.exit(1)
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const { articles = [], authors = [] } = JSON.parse(rawData)

  console.log(`🔍 Found ${articles.length} articles to import into ReportlyFeed...`)

  // Ensure default author exists
  let defaultAuthorId = ''
  const existingAuthors = await payload.find({ collection: 'authors', limit: 1 })
  if (existingAuthors.docs.length > 0) {
    defaultAuthorId = existingAuthors.docs[0].id
  } else {
    const createdAuthor = await payload.create({
      collection: 'authors',
      data: {
        name: 'Reportly Editorial Board',
        slug: 'reportly-editorial-board',
        role: 'Senior Investigative Desk',
      },
    })
    defaultAuthorId = createdAuthor.id
  }

  // Ensure default categories map exists
  const existingCategories = await payload.find({ collection: 'categories', limit: 100 })
  const categoryMap: Record<string, string> = {}
  for (const cat of existingCategories.docs) {
    categoryMap[cat.slug] = cat.id
  }

  // Import each article
  let importedCount = 0
  for (const art of articles) {
    if (!art.title || !art.slug) continue

    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: art.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`⏩ Article already exists: "${art.title}"`)
      continue
    }

    // Handle Cover Image
    let mediaId = ''
    if (art.coverImage && typeof art.coverImage === 'object') {
      const imgObj = art.coverImage
      const extUrl = imgObj.externalUrl || imgObj.url || ''

      if (extUrl) {
        const existingMedia = await payload.find({
          collection: 'media',
          where: { externalUrl: { equals: extUrl } },
          limit: 1,
        })

        if (existingMedia.docs.length > 0) {
          mediaId = existingMedia.docs[0].id
        } else {
          // Create dummy sample local file for payload upload validation if needed
          const sampleFilePath = path.resolve(process.cwd(), 'public/media/cover.jpg')
          const createdMedia = await payload.create({
            collection: 'media',
            filePath: sampleFilePath,
            data: {
              alt: art.title,
              source: 'external',
              externalUrl: extUrl.startsWith('http') ? extUrl : `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1600&auto=format&fit=crop`,
            },
          })
          mediaId = createdMedia.id
        }
      }
    }

    // Assign category matching slug or fallback
    let catId = categoryMap['politics'] || Object.values(categoryMap)[0]
    if (art.category && typeof art.category === 'object' && art.category.slug && categoryMap[art.category.slug]) {
      catId = categoryMap[art.category.slug]
    }

    try {
      console.log(`📥 Importing article: "${art.title}"`)
      await payload.create({
        collection: 'articles',
        data: {
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt || art.title,
          content: art.content || {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: art.excerpt || art.title }],
                },
              ],
            },
          },
          coverImage: mediaId || Object.values(categoryMap)[0],
          category: catId,
          author: defaultAuthorId,
          tags: Array.isArray(art.tags) ? art.tags : [],
          status: 'published',
          isBreaking: !!art.isBreaking,
          isFeatured: !!art.isFeatured,
          publishedAt: art.publishedAt || new Date().toISOString(),
          readTime: art.readTime || 3,
          credit: art.credit || 'Reportly Wire Service',
        },
      })
      importedCount++
    } catch (err: any) {
      console.warn(`⚠️ Failed to import "${art.title}":`, err.message)
    }
  }

  console.log(`🎉 Successfully imported ${importedCount} articles into ReportlyFeed!`)
  process.exit(0)
}

importPulefeedArticles().catch((err) => {
  console.error('❌ Import failed:', err)
  process.exit(1)
})
