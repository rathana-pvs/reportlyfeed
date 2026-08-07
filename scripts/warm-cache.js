import fs from 'fs'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reportlyfeed.com'
const DELAY_MS = 100 // 100ms delay between requests to keep server smooth

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function runWarmCache() {
  console.log(`🔥 [Cache Warmer] Starting background cache warming for ${SITE_URL} ...`)

  // 1. Core pages
  const corePages = ['/', '/live', '/about', '/contact', '/privacy', '/search']
  for (const page of corePages) {
    try {
      const res = await fetch(`${SITE_URL}${page}`)
      console.log(`  🔥 Core page ${page} -> Status ${res.status} (${res.headers.get('x-nextjs-cache') || 'OK'})`)
    } catch (e) {
      console.warn(`  ⚠️ Failed to warm ${page}:`, e.message)
    }
  }

  // 2. Fetch the 40 latest articles dynamically from REST API
  try {
    console.log(`\n📡 Fetching article index from ${SITE_URL}/api/articles?limit=40 ...`)
    const res = await fetch(`${SITE_URL}/api/articles?limit=40`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const articles = data.docs || []
    console.log(`📰 Found ${articles.length} articles to warm. Starting background warming...\n`)

    let success = 0
    let failed = 0

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i]
      const url = `${SITE_URL}/article/${art.slug}`
      const prefix = `[${i + 1}/${articles.length}]`

      try {
        const pageRes = await fetch(url)
        if (pageRes.ok) {
          success++
          console.log(`  ${prefix} 🔥 Warmed /article/${art.slug.slice(0, 35)}... (${pageRes.headers.get('x-nextjs-cache') || 'OK'})`)
        } else {
          failed++
          console.warn(`  ${prefix} ⚠️ Status ${pageRes.status} for /article/${art.slug}`)
        }
      } catch (err) {
        failed++
        console.warn(`  ${prefix} ❌ Error warming article ${art.slug}:`, err.message)
      }

      await sleep(DELAY_MS)
    }

    console.log(`\n==============================================`)
    console.log(`🎉 [Cache Warmer Complete] Summary:`)
    console.log(`- Successfully Warmed: ${success}`)
    console.log(`- Failed: ${failed}`)
    console.log(`- Total Articles: ${articles.length}`)
    console.log(`==============================================\n`)
  } catch (err) {
    console.error('❌ Cache warmer failed:', err.message)
  }
}

runWarmCache()
