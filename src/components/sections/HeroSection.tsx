import React from 'react'
import { Article } from '@/types'
import { ArticleCard } from '../ui/ArticleCard'

interface HeroSectionProps {
  articles: Article[]
}

export const HeroSection: React.FC<HeroSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  const mainHero = articles[0]
  const sideArticles = articles.slice(1, 4)

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleCard article={mainHero} variant="hero" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent-primary border-b border-border pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            Top Stories
          </h3>
          {sideArticles.map((art: Article) => (
            <ArticleCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  )
}
