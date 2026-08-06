import React from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { MessageSquare } from 'lucide-react'

interface OpinionSectionProps {
  articles: Article[]
}

export const OpinionSection: React.FC<OpinionSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  return (
    <section className="mb-12 bg-bg-surface border border-border rounded-xl p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent-primary" />
          <h2 className="text-2xl font-extrabold text-text-primary uppercase tracking-tight">
            Editorials & AP Commentary
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((item: Article) => (
          <article key={item.id} className="bg-bg-card border border-border p-5 rounded-lg space-y-3 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <span className="text-[10px] font-sans text-accent-primary uppercase font-extrabold tracking-wider">
                AP Commentary
              </span>
              <h3 className="text-base font-extrabold text-text-primary hover:text-accent-primary transition-colors leading-snug tracking-tight">
                <Link href={`/article/${item.slug}`}>
                  "{item.title}"
                </Link>
              </h3>
              <p className="text-text-secondary text-xs line-clamp-3 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
