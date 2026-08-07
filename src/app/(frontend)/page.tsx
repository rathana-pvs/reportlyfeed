import React from 'react'
import { getArticles } from '@/lib/api-server'
import { HeroSection } from '@/components/sections/HeroSection'
import { LatestNewsGrid } from '@/components/sections/LatestNewsGrid'
import { OpinionSection } from '@/components/sections/OpinionSection'
import { MostRead } from '@/components/sections/MostRead'
import { AdskeeperWidget } from '@/components/ads/AdskeeperWidget'

export const revalidate = 60

export default async function HomePage() {
  const [featuredArticles, latestArticles] = await Promise.all([
    getArticles({ isFeatured: true, limit: 4 }),
    getArticles({ limit: 12 }),
  ])

  const heroArticles = featuredArticles.length > 0 ? featuredArticles : latestArticles.slice(0, 4)
  const remainingLatest = latestArticles.slice(4)

  return (
    <div className="space-y-12">
      {/* Hero Featured Grid */}
      <HeroSection articles={heroArticles} />

      {/* Feed Ad Widget Zone */}
      <AdskeeperWidget
        widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED || '2065377'}
        label="Bottom Feed Ads"
      />

      {/* Main Content Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LatestNewsGrid articles={remainingLatest} title="Latest Investigated Reports" />
        </div>
        <div>
          <MostRead articles={latestArticles} />
        </div>
      </div>

      {/* Editorial & Opinion Section */}
      <OpinionSection articles={latestArticles.slice(0, 3)} />
    </div>
  )
}
