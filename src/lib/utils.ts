import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return ''
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy • HH:mm')
  } catch {
    return dateString
  }
}

export function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return ''
  try {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return dateString
  }
}

export function calcReadTime(content: any): number {
  if (!content) return 1
  const str = typeof content === 'string' ? content : JSON.stringify(content)
  const words = str.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function truncate(str: string, length: number): string {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

const DEFAULT_NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop',
]

export function getImageUrl(image: any, fallbackKey?: string | number): string {
  if (!image) {
    if (fallbackKey !== undefined) {
      const num = typeof fallbackKey === 'number' ? fallbackKey : String(fallbackKey).length
      return DEFAULT_NEWS_IMAGES[num % DEFAULT_NEWS_IMAGES.length]
    }
    return DEFAULT_NEWS_IMAGES[0]
  }

  let url = ''
  if (typeof image === 'string') {
    url = image
  } else if (image.externalUrl) {
    url = image.externalUrl
  } else if (image.url) {
    url = image.url
  }

  if (!url) return DEFAULT_NEWS_IMAGES[0]

  // If local /media/ path is passed
  if (url.includes('/media/')) {
    const filename = url.split('/media/').pop() || ''
    // Ignore dummy placeholder files (e.g. 134-byte cover-X.jpg) and fallback to externalUrl or DEFAULT_NEWS_IMAGES
    if (filename.startsWith('cover-')) {
      if (image && typeof image === 'object' && image.externalUrl) {
        return image.externalUrl
      }
      return DEFAULT_NEWS_IMAGES[0]
    }
    return `/media/${filename}`
  }

  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }

  return url
}
