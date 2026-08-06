export interface Media {
  id: string
  alt?: string
  caption?: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  source?: 'local' | 'external'
  externalUrl?: string
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number }
    card?: { url?: string; width?: number; height?: number }
    hero?: { url?: string; width?: number; height?: number }
  }
  createdAt: string
  updatedAt: string
}

export interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  avatar?: string | Media
  role?: string
  twitter?: string
  email?: string
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: any
  coverImage: string | Media
  credit?: string
  status: 'draft' | 'published' | 'archived'
  isBreaking?: boolean
  isFeatured?: boolean
  publishedAt: string
  readTime?: number
  og?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string | Media
  }
  createdAt: string
  updatedAt: string
}

export interface ShareLink {
  id: string
  key: string
  article: string | Article
  label?: string
  clicks: number
  createdAt: string
  updatedAt: string
}
