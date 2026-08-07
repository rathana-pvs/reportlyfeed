/**
 * HTTP REST API Importer for ReportlyFeed (pulefeed_data.json)
 * Usage:
 *   node migrate-api.js --url http://72.61.12.198 --email admin@reportlyfeed.com --password adminpassword123
 */

import fs from 'fs'
import path from 'path'

function parseArgs() {
  const args = process.argv.slice(2)
  const config = {
    url: 'http://72.61.12.198',
    email: 'admin@reportlyfeed.com',
    password: 'adminpassword123',
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.url = args[i + 1].replace(/\/$/, '')
    if (args[i] === '--email' && args[i + 1]) config.email = args[i + 1]
    if (args[i] === '--password' && args[i + 1]) config.password = args[i + 1]
  }
  return config
}

async function run() {
  const config = parseArgs()
  console.log(`🚀 Starting HTTP REST API Import target: ${config.url}`)

  const dataPath = path.resolve(process.cwd(), 'pulefeed_data.json')
  if (!fs.existsSync(dataPath)) {
    console.error('❌ pulefeed_data.json not found!')
    process.exit(1)
  }

  const { articles = [] } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  console.log(`🔍 Read ${articles.length} articles from pulefeed_data.json`)

  // 1. Authenticate via REST API
  let token = ''
  let userId = ''
  try {
    const loginRes = await fetch(`${config.url}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
    })

    if (loginRes.ok) {
      const loginData = await loginRes.json()
      token = loginData.token
      userId = loginData.user?.id
      console.log(`🔑 Authenticated as ${config.email}`)
    } else {
      console.log(`⚠️ User login failed, attempting to register initial admin user...`)
      const regRes = await fetch(`${config.url}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: config.email,
          password: config.password,
          name: 'Reportly Admin',
          role: 'admin',
        }),
      })
      if (regRes.ok) {
        const regData = await regRes.json()
        token = regData.token
        userId = regData.doc?.id
        console.log(`👤 Created initial admin user successfully`)
      } else {
        const errText = await regRes.text()
        console.error(`❌ Admin user registration failed:`, errText)
      }
    }
  } catch (err) {
    console.error('❌ Authentication request failed:', err.message)
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `JWT ${token}` } : {}),
  }

  // 2. Fetch or Create Default Author
  let authorId = ''
  try {
    const authorRes = await fetch(`${config.url}/api/authors?limit=1`, { headers: authHeaders })
    if (authorRes.ok) {
      const authorData = await authorRes.json()
      if (authorData.docs && authorData.docs.length > 0) {
        authorId = authorData.docs[0].id
      }
    }
    if (!authorId) {
      const newAuthorRes = await fetch(`${config.url}/api/authors`, {
        method: 'POST',
        headers: authHeaders,
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
  } catch (e) {
    console.warn('⚠️ Author setup notice:', e.message)
  }

  // 3. Fetch or Create Default Media
  let defaultMediaId = ''
  try {
    const mediaRes = await fetch(`${config.url}/api/media?limit=1`, { headers: authHeaders })
    if (mediaRes.ok) {
      const mediaData = await mediaRes.json()
      if (mediaData.docs && mediaData.docs.length > 0) {
        defaultMediaId = mediaData.docs[0].id
      }
    }
  } catch (e) {}

  // 4. Import Articles via HTTP REST API
  let importedCount = 0
  let skippedCount = 0

  for (const art of articles) {
    if (!art.title || !art.slug) continue

    // Check if article already exists
    try {
      const checkRes = await fetch(`${config.url}/api/articles?where[slug][equals]=${encodeURIComponent(art.slug)}`, {
        headers: authHeaders,
      })
      if (checkRes.ok) {
        const checkData = await checkRes.json()
        if (checkData.docs && checkData.docs.length > 0) {
          console.log(`⏩ Article exists: "${art.title}"`)
          skippedCount++
          continue
        }
      }
    } catch (e) {}

    let mediaId = defaultMediaId

    try {
      console.log(`📥 Posting article via HTTP: "${art.title}"`)
      const postRes = await fetch(`${config.url}/api/articles`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
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
          tags: Array.isArray(art.tags) ? art.tags : [],
          status: 'published',
          isBreaking: !!art.isBreaking,
          isFeatured: !!art.isFeatured,
          publishedAt: art.publishedAt || new Date().toISOString(),
          readTime: art.readTime || 3,
          credit: art.credit || 'Reportly Wire Service',
        }),
      })

      if (postRes.ok) {
        importedCount++
      } else {
        const errJson = await postRes.json().catch(() => ({}))
        console.warn(`⚠️ Failed to post "${art.title}":`, JSON.stringify(errJson))
      }
    } catch (err) {
      console.warn(`⚠️ Error posting "${art.title}":`, err.message)
    }
  }

  console.log(`🎉 HTTP Import Finished! Successfully imported ${importedCount} articles (${skippedCount} already existed).`)
}

run()
