'use client'

import React, { useState } from 'react'
import { AdskeeperWidget } from '@/components/ads/AdskeeperWidget'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

interface ArticleContentProps {
  content: any
  excerpt?: string
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ content, excerpt }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Helper to render individual blocks from Lexical AST
  const renderBlock = (block: any, index: number) => {
    if (!block) return null

    if (block.type === 'paragraph') {
      const children = block.children?.map((c: any, idx: number) => {
        if (c.type === 'link' || c.fields?.url) {
          const href = c.fields?.url || c.url || '#'
          const text = c.children?.map((child: any) => child.text).join('') || c.text || href
          return (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary underline hover:opacity-80 transition-opacity"
            >
              {text}
            </a>
          )
        }
        let node: React.ReactNode = c.text || ''
        if (c.format & 1 || c.bold) node = <strong key={`b-${idx}`}>{node}</strong>
        if (c.format & 2 || c.italic) node = <em key={`i-${idx}`}>{node}</em>
        return <React.Fragment key={idx}>{node}</React.Fragment>
      })
      const textContent = block.children?.map((c: any) => c.text || '').join('').trim()
      if (!textContent && (!children || children.length === 0)) return null
      return (
        <p key={index} className="text-text-primary text-base sm:text-lg font-serif leading-relaxed my-4">
          {children}
        </p>
      )
    }

    if (block.type === 'heading') {
      const children = block.children?.map((c: any) => c.text || '').join('')
      const Tag = (block.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <Tag key={index} className="text-xl sm:text-2xl font-bold font-sans text-text-primary mt-8 mb-4">
          {children}
        </Tag>
      )
    }

    if (block.type === 'quote') {
      const children = block.children?.map((c: any) => c.text || '').join('')
      return (
        <blockquote key={index} className="border-l-4 border-accent-primary pl-4 py-1 italic text-text-secondary font-serif my-6 bg-bg-surface/50 rounded-r">
          {children}
        </blockquote>
      )
    }

    if (block.type === 'list') {
      const isOrdered = block.tag === 'ol' || block.listType === 'number'
      const ListTag = isOrdered ? 'ol' : 'ul'
      return (
        <ListTag key={index} className={`my-4 pl-6 space-y-2 text-text-primary font-serif ${isOrdered ? 'list-decimal' : 'list-disc'}`}>
          {block.children?.map((item: any, idx: number) => (
            <li key={idx}>{item.children?.map((c: any) => c.text || '').join('')}</li>
          ))}
        </ListTag>
      )
    }

    if (block.type === 'block' && block.fields?.blockType === 'videoEmbed') {
      const url = block.fields?.url
      if (!url) return null
      let embedUrl = url
      if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/')
      else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/')
      return (
        <div key={index} className="my-6 aspect-video w-full rounded-lg overflow-hidden bg-black border border-border">
          <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video Embed" />
        </div>
      )
    }

    if (block.type === 'block' && block.fields?.blockType === 'twitterEmbed') {
      const { url, tweetText, author, authorHandle, date } = block.fields || {}
      return (
        <div key={index} className="my-6 p-4 rounded-xl border border-border bg-bg-surface/60 max-w-xl mx-auto shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-xs">
                {author ? author.charAt(0).toUpperCase() : 'X'}
              </div>
              <div>
                <div className="font-semibold text-text-primary text-sm leading-tight">{author || 'Post'}</div>
                <div className="text-text-muted text-xs">{authorHandle || '@x'}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-muted fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          {tweetText && <p className="text-text-primary font-sans text-sm mb-3 leading-normal whitespace-pre-wrap">{tweetText}</p>}
          <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/50">
            <span>{date || ''}</span>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">
                View on X
              </a>
            )}
          </div>
        </div>
      )
    }

    if (block.type === 'upload' && block.value?.url) {
      const imgUrl = getImageUrl(block.value)
      return (
        <div key={index} className="my-6 space-y-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-bg-surface border border-border">
            <Image src={imgUrl} alt={block.value?.alt || 'Article Image'} fill className="object-cover" />
          </div>
        </div>
      )
    }

    return null
  }

  // Handle plain string content fallback
  if (typeof content === 'string') {
    return (
      <div className="prose prose-invert max-w-none">
        <p className="text-text-primary text-base sm:text-lg font-serif leading-relaxed">{content}</p>
        <AdskeeperWidget
          widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1}
          label="In-Article Ad 1"
        />
      </div>
    )
  }

  const blocks = content?.root?.children || []
  if (blocks.length === 0) {
    return excerpt ? (
      <div className="prose prose-invert max-w-none">
        <p className="text-text-primary text-base sm:text-lg font-serif leading-relaxed">{excerpt}</p>
        <AdskeeperWidget
          widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1}
          label="In-Article Ad 1"
        />
      </div>
    ) : null
  }

  const p1 = blocks[0]
  const p2 = blocks[1]
  const remainingBlocks = blocks.slice(2)
  const hasMoreContent = remainingBlocks.length > 0

  return (
    <div className="space-y-6">
      {/* 1. Paragraph 1 (p1) */}
      <div>{renderBlock(p1, 0)}</div>

      {/* 2. Ads (in_article_1) */}
      <AdskeeperWidget
        widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1}
        label="In-Article Ad 1"
      />

      {/* 3. Paragraph 2 (p2) with very light blur effect when collapsed */}
      {p2 && (
        <div className="relative">
          <div className={!isExpanded && hasMoreContent ? 'relative overflow-hidden select-none max-h-24' : ''}>
            <div className={!isExpanded && hasMoreContent ? 'filter blur-[1px] opacity-90 pointer-events-none transition-all duration-300' : ''}>
              {renderBlock(p2, 1)}
            </div>
            {!isExpanded && hasMoreContent && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
            )}
          </div>
        </div>
      )}

      {/* 4. Read More Button trigger */}
      {!isExpanded && hasMoreContent && (
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="group inline-flex items-center gap-2.5 px-7 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white font-mono text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Read More</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      )}

      {/* 5. Expanded Content (in_article_2 -> p3 -> p4 ...) */}
      {isExpanded && (
        <div className="space-y-6 animate-fadeIn">
          {/* Ads (in_article_2) */}
          <AdskeeperWidget
            widgetId={process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2}
            label="In-Article Ad 2"
          />

          {/* Remaining Paragraphs & Blocks (p3, p4, ...) */}
          {remainingBlocks.map((block: any, idx: number) => renderBlock(block, idx + 2))}
        </div>
      )}
    </div>
  )
}
