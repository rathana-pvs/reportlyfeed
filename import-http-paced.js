import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://72.61.12.198'
const EMAIL = 'admin@reportlyfeed.com'
const PASSWORD = 'adminpassword123'
const DELAY_MS = 2000 // 2 seconds between posts

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function runPacedImport() {
  console.log(`🚀 Starting HTTP REST API Paced Importer to target: ${BASE_URL}`)

  const dataPath = path.resolve(process.cwd(), 'pulefeed_data.json')
  if (!fs.existsSync(dataPath)) {
    console.error('❌ pulefeed_data.json not found!')
    process.exit(1)
  }

  const { articles = [] } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  console.log(`📋 Total articles in file: ${articles.length}`)

  // 1. Authenticate via REST API
  const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  if (!loginRes.ok) {
    console.error('❌ Login failed:', await loginRes.text())
    process.exit(1)
  }

  const { token, user } = await loginRes.json()
  console.log(`🔑 Authenticated as ${user.email} (User ID: ${user.id})`)

  const jsonHeaders = {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  }

  // 2. Fetch or Create Default Author
  let authorId = ''
  const authorRes = await fetch(`${BASE_URL}/api/authors?limit=1`, { headers: jsonHeaders })
  if (authorRes.ok) {
    const authorData = await authorRes.json()
    if (authorData.docs && authorData.docs.length > 0) {
      authorId = authorData.docs[0].id
    }
  }

  if (!authorId) {
    const newAuthorRes = await fetch(`${BASE_URL}/api/authors`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        name: 'Reportly Editorial Board',
        slug: 'reportly-editorial-board',
        role: 'Senior Investigative Desk',
      }),
    })
    if (newAuthorRes.ok) {
      const createdAuthor = await newAuthorRes.json()
      authorId = createdAuthor.doc?.id || createdAuthor.id
    }
  }
  console.log(`✍️ Author ID: ${authorId}`)

  // 3. Upload Media Asset for Cover Image
  let mediaId = ''
  const mediaCheckRes = await fetch(`${BASE_URL}/api/media?limit=1`, { headers: jsonHeaders })
  if (mediaCheckRes.ok) {
    const mediaData = await mediaCheckRes.json()
    if (mediaData.docs && mediaData.docs.length > 0) {
      mediaId = mediaData.docs[0].id
    }
  }

  if (!mediaId) {
    console.log(`🖼️ Uploading media cover image...`)
    const coverPath = path.resolve(process.cwd(), 'public/media/cover.jpg')
    const fileBuffer = fs.readFileSync(coverPath)
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' })

    const formData = new FormData()
    formData.append('file', blob, 'cover.jpg')
    formData.append('alt', 'Reportly Cover Image')
    formData.append('source', 'external')
    formData.append(
      'externalUrl',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop'
    )

    const uploadRes = await fetch(`${BASE_URL}/api/media`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: formData,
    })

    if (uploadRes.ok) {
      const uploadedMedia = await uploadRes.json()
      mediaId = uploadedMedia.doc?.id || uploadedMedia.id
      console.log(`🖼️ Media Uploaded Successfully! Media ID: ${mediaId}`)
    } else {
      console.error(`❌ Media upload failed:`, await uploadRes.text())
      process.exit(1)
    }
  } else {
    console.log(`🖼️ Using existing Media ID: ${mediaId}`)
  }

  // 4. Post Each News Article Sequentially via HTTP REST API
  let successCount = 0
  let skipCount = 0
  let failCount = 0

  console.log(`\n📡 Starting sequential HTTP REST API posting with ${DELAY_MS}ms delay between requests...\n`)

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i]
    if (!art.title || !art.slug) continue

    const prefix = `[${i + 1}/${articles.length}]`

    // Check if article exists
    const checkRes = await fetch(`${BASE_URL}/api/articles?where[slug][equals]=${encodeURIComponent(art.slug)}`, {
      headers: jsonHeaders,
    })
    if (checkRes.ok) {
      const checkData = await checkRes.json()
      if (checkData.docs && checkData.docs.length > 0) {
        console.log(`⏩ ${prefix} Already exists on server: "${art.title}"`)
        skipCount++
        await sleep(300)
        continue
      }
    }

    console.log(`📥 ${prefix} Posting via HTTP: "${art.title}"...`)

    const articleData = {
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
      coverImage: mediaId,
      author: authorId,
      tags: Array.isArray(art.tags) ? art.tags : [],
      status: 'published',
      isBreaking: !!art.isBreaking,
      isFeatured: !!art.isFeatured,
      publishedAt: art.publishedAt || new Date().toISOString(),
      readTime: art.readTime || 3,
      credit: art.credit || 'Reportly Wire Service',
    }

    const postRes = await fetch(`${BASE_URL}/api/articles`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(articleData),
    })

    if (postRes.ok) {
      const createdDoc = await postRes.json()
      const docId = createdDoc.doc?.id || createdDoc.id
      console.log(`✅ ${prefix} Successfully posted! (Article ID: ${docId})`)
      successCount++
    } else {
      const errText = await postRes.text()
      console.warn(`❌ ${prefix} HTTP Failed:`, errText)
      failCount++
    }

    // Pacing delay between HTTP requests
    await sleep(DELAY_MS)
  }

  console.log(`\n==============================================`)
  console.log(`🎉 HTTP Paced Import Complete!`)
  console.log(`- Successfully posted: ${successCount}`)
  console.log(`- Already existed: ${skipCount}`)
  console.log(`- Failed: ${failCount}`)
  console.log(`==============================================\n`)
}

runPacedImport().catch((e) => console.error('Fatal error:', e))
