import fs from 'fs'
import path from 'path'

const TARGET_URL = 'http://72.61.12.198'
const SOURCE_URL = 'https://pulefeed.tech'
const EMAIL = 'admin@reportlyfeed.com'
const PASSWORD = 'adminpassword123'
const DELAY_MS = 1500 // 1.5s pacing delay

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function runScrapeAndImport() {
  console.log(`🚀 Starting Pulefeed Scrape & Fresh HTTP REST API Import...`)

  // 1. Authenticate on Target Server
  const loginRes = await fetch(`${TARGET_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  if (!loginRes.ok) {
    console.error('❌ Login failed on target server:', await loginRes.text())
    process.exit(1)
  }

  const { token } = await loginRes.json()
  console.log(`🔑 Authenticated as admin on ${TARGET_URL}`)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  }

  // 2. Delete All Existing Articles on Target Server
  console.log(`\n🧹 Step 1: Deleting existing articles on target server...`)
  const existingRes = await fetch(`${TARGET_URL}/api/articles?limit=1000`, { headers: authHeaders })
  if (existingRes.ok) {
    const existingData = await existingRes.json()
    const existingDocs = existingData.docs || []
    console.log(`🗑️ Found ${existingDocs.length} articles to delete.`)

    for (const doc of existingDocs) {
      const delRes = await fetch(`${TARGET_URL}/api/articles/${doc.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      if (delRes.ok) {
        console.log(`  ❌ Deleted old article #${doc.id}: "${doc.title.slice(0, 40)}..."`)
      }
      await sleep(200)
    }
  }

  // 3. Fetch Live 40 Articles from Pulefeed.tech
  console.log(`\n📡 Step 2: Fetching live 40 news items from ${SOURCE_URL}/api/articles?limit=40 ...`)
  const sourceRes = await fetch(`${SOURCE_URL}/api/articles?limit=40`)
  if (!sourceRes.ok) {
    console.error(`❌ Failed to fetch from source pulefeed.tech: status ${sourceRes.status}`)
    process.exit(1)
  }

  const sourceData = await sourceRes.json()
  const freshArticles = sourceData.docs || []
  console.log(`📰 Retreived ${freshArticles.length} live articles from Pulefeed!`)

  // 4. Ensure Default Author exists
  let authorId = ''
  const authorRes = await fetch(`${TARGET_URL}/api/authors?limit=1`, { headers: authHeaders })
  if (authorRes.ok) {
    const authorData = await authorRes.json()
    if (authorData.docs && authorData.docs.length > 0) {
      authorId = authorData.docs[0].id
    }
  }

  if (!authorId) {
    const createAuthorRes = await fetch(`${TARGET_URL}/api/authors`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Reportly Editorial Board',
        slug: 'reportly-editorial-board',
        role: 'Senior Investigative Desk',
      }),
    })
    if (createAuthorRes.ok) {
      const createdAuthor = await createAuthorRes.json()
      authorId = createdAuthor.doc?.id || createdAuthor.id
    }
  }

  // 5. Download exact cover images and post articles sequentially via HTTP REST API
  console.log(`\n📥 Step 3: Downloading exact matching cover images & posting via HTTP REST API...\n`)

  const tempDir = path.resolve(process.cwd(), 'tmp_pulefeed_images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < freshArticles.length; i++) {
    const art = freshArticles[i]
    const prefix = `[${i + 1}/${freshArticles.length}]`

    console.log(`📷 ${prefix} Processing: "${art.title}"`)

    // Extract exact cover image URL from Pulefeed
    const coverObj = art.coverImage || {}
    let imageUrl = coverObj.url || coverObj.externalUrl || ''

    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${SOURCE_URL}${imageUrl}`
    }

    let mediaId = ''

    if (imageUrl) {
      try {
        console.log(`   ⬇️ Downloading cover image: ${imageUrl}`)
        const imgFetchRes = await fetch(imageUrl)

        if (imgFetchRes.ok) {
          const arrayBuffer = await imgFetchRes.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const ext = imageUrl.endsWith('.png') ? 'png' : 'jpg'
          const mimeType = imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg'

          // Upload image to target server /api/media via HTTP FormData
          const blob = new Blob([buffer], { type: mimeType })
          const formData = new FormData()
          formData.append('file', blob, `pulefeed_${i + 1}.${ext}`)
          formData.append('alt', art.title)
          formData.append('source', 'external')
          formData.append('externalUrl', imageUrl)

          const uploadRes = await fetch(`${TARGET_URL}/api/media`, {
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: formData,
          })

          if (uploadRes.ok) {
            const uploadedDoc = await uploadRes.json()
            mediaId = uploadedDoc.doc?.id || uploadedDoc.id
            console.log(`   🖼️ Uploaded matching cover image (Media ID: ${mediaId})`)
          } else {
            console.warn(`   ⚠️ Media upload notice:`, await uploadRes.text())
          }
        }
      } catch (err) {
        console.warn(`   ⚠️ Image fetch error:`, err.message)
      }
    }

    // Clean up content & fields
    const articlePayload = {
      title: art.title,
      slug: art.slug,
      excerpt: (art.excerpt || art.title).slice(0, 250),
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
      ...(mediaId ? { coverImage: mediaId } : {}),
      ...(authorId ? { author: authorId } : {}),
      tags: Array.isArray(art.tags) ? art.tags.map((t) => (typeof t === 'object' ? t.tag : t)) : [],
      status: 'published',
      isBreaking: !!art.isBreaking,
      isFeatured: !!art.isFeatured,
      publishedAt: art.publishedAt || new Date().toISOString(),
      readTime: art.readTime || 3,
      credit: art.credit || 'Pulefeed Wire Service',
    }

    // Post to TARGET_URL /api/articles
    const postRes = await fetch(`${TARGET_URL}/api/articles`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(articlePayload),
    })

    if (postRes.ok) {
      const createdArticle = await postRes.json()
      const docId = createdArticle.doc?.id || createdArticle.id
      console.log(`   ✅ Article #${docId} posted successfully!`)
      successCount++
    } else {
      const errText = await postRes.text()
      console.warn(`   ❌ Article post failed:`, errText)
      failCount++
    }

    // Pacing delay
    await sleep(DELAY_MS)
  }

  console.log(`\n==============================================`)
  console.log(`🎉 Pulefeed Live Scrape & Import Summary:`)
  console.log(`- Successfully scraped & posted: ${successCount}`)
  console.log(`- Failed: ${failCount}`)
  console.log(`==============================================\n`)
}

runScrapeAndImport().catch((e) => console.error('Fatal error:', e))
