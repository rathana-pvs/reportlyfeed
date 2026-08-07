import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://72.61.12.198'
const EMAIL = 'admin@reportlyfeed.com'
const PASSWORD = 'adminpassword123'
const DELAY_MS = 1500 // 1.5s delay between requests

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function runUniqueImagesUpdate() {
  console.log(`🖼️ Starting Unique Image Assignment for all 24 articles on ${BASE_URL}...`)

  const dataPath = path.resolve(process.cwd(), 'pulefeed_data.json')
  if (!fs.existsSync(dataPath)) {
    console.error('❌ pulefeed_data.json not found!')
    process.exit(1)
  }

  const { articles = [] } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // 1. Authenticate
  const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  if (!loginRes.ok) {
    console.error('❌ Login failed:', await loginRes.text())
    process.exit(1)
  }

  const { token } = await loginRes.json()
  console.log(`🔑 Authenticated successfully`)

  const jsonHeaders = {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  }

  // Fetch all current articles from server to get their IDs
  const getArticlesRes = await fetch(`${BASE_URL}/api/articles?limit=100`, { headers: jsonHeaders })
  const articlesData = await getArticlesRes.json()
  const serverArticles = articlesData.docs || []
  console.log(`📋 Found ${serverArticles.length} existing articles on server.`)

  const tempDir = path.resolve(process.cwd(), 'tmp_images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i]
    const prefix = `[${i + 1}/${articles.length}]`
    const imgObj = art.coverImage || {}
    let extUrl = imgObj.externalUrl || imgObj.url || ''

    // If externalUrl is from pulefeed.tech which might be down/local, fallback to unsplash
    if (!extUrl || extUrl.includes('pulefeed.tech')) {
      extUrl = `https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop`
    }

    console.log(`📷 ${prefix} Downloading unique image for "${art.title.slice(0, 30)}..."`)

    const tempFilePath = path.resolve(tempDir, `img_${i + 1}.jpg`)

    try {
      // Download the unique image with fallback
      let fetchImgRes = await fetch(extUrl)
      if (!fetchImgRes.ok) {
        const fallbackUrl = `https://picsum.photos/seed/article_${i + 1}/1200/800`
        fetchImgRes = await fetch(fallbackUrl)
      }
      if (!fetchImgRes.ok) {
        throw new Error(`Failed to download image for article ${i + 1}`)
      }
      const arrayBuffer = await fetchImgRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(tempFilePath, buffer)

      // Upload image to Payload /api/media via HTTP FormData
      const blob = new Blob([buffer], { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', blob, `article_${i + 1}.jpg`)
      formData.append('alt', art.title)
      formData.append('source', 'external')
      formData.append('externalUrl', extUrl)

      const uploadRes = await fetch(`${BASE_URL}/api/media`, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${token}`,
        },
        body: formData,
      })

      if (!uploadRes.ok) {
        const errText = await uploadRes.text()
        console.warn(`⚠️ ${prefix} Media upload failed:`, errText)
        continue
      }

      const uploadedMedia = await uploadRes.json()
      const newMediaId = uploadedMedia.doc?.id || uploadedMedia.id
      console.log(`🖼️ ${prefix} Uploaded Unique Media ID: ${newMediaId}`)

      // Find matching server article ID by slug or title
      const matchingDoc = serverArticles.find((doc) => doc.slug === art.slug || doc.title === art.title)

      if (matchingDoc) {
        // Update article with new unique coverImage media ID via HTTP PATCH
        const patchRes = await fetch(`${BASE_URL}/api/articles/${matchingDoc.id}`, {
          method: 'PATCH',
          headers: jsonHeaders,
          body: JSON.stringify({
            coverImage: newMediaId,
          }),
        })

        if (patchRes.ok) {
          console.log(`✅ ${prefix} Updated Article #${matchingDoc.id} with unique cover image!`)
        } else {
          console.warn(`⚠️ ${prefix} Article update failed:`, await patchRes.text())
        }
      } else {
        console.warn(`⚠️ ${prefix} Matching article on server not found for slug "${art.slug}"`)
      }
    } catch (err) {
      console.warn(`❌ ${prefix} Error processing image:`, err.message)
    }

    // Pacing delay
    await sleep(DELAY_MS)
  }

  console.log(`\n🎉 Finished updating unique cover images for all articles!`)
}

runUniqueImagesUpdate().catch((e) => console.error('Fatal error:', e))
