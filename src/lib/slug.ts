import { slugify } from './utils'

// Editorial noise words and prefixes to strip from article headlines
const EDITORIAL_NOISE_PATTERNS = [
  /^(breaking news|breaking|urgent|alert|just in|exclusive|update|watch|live|opinion|analysis|report|fact check)[\s:–—|-]+/i,
  /[\s:–—|-]+(reportlyfeedcom|reportlyfeed|reportly|reuters|ap news|cnn|bbc)[\s.]*$/i,
]

// Common filler/stop words in English headlines (note: 'us' removed so U.S. is preserved)
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does',
  'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll',
  'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its',
  'itself', 'just', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
  'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
  'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve',
  'your', 'yours', 'yourself', 'yourselves',
  // Extra headline filler
  'within', 'hours', 'days', 'weeks', 'still', 'demands', 'tells', 'says', 'amid'
])

export interface GenerateSmartSlugOptions {
  minWords?: number
  maxWords?: number
  maxLength?: number
}

/**
 * Generates a concise, readable, smart slug (4-5 key words by default)
 * from a given headline by stripping editorial noise and stop words.
 */
export function generateSmartSlug(text: string, options: GenerateSmartSlugOptions = {}): string {
  if (!text || typeof text !== 'string') return ''

  const minWords = options.minWords ?? 4
  const maxWords = options.maxWords ?? 5
  const maxLength = options.maxLength ?? 50

  let cleaned = text.trim()

  // 1. Remove editorial noise prefixes & branding suffixes
  for (const pattern of EDITORIAL_NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '').trim()
  }

  // Normalize common acronyms with dots: U.S. -> US, U.K. -> UK, E.U. -> EU
  cleaned = cleaned.replace(/\b([a-zA-Z])\.([a-zA-Z])\./g, '$1$2')

  // 2. Normalize and extract individual words (Unicode aware)
  const rawWords = cleaned
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove punctuation like quotes, commas, brackets, etc.
    .replace(/['’"“”«»`]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    .filter(w => w.length > 0)

  if (rawWords.length === 0) {
    return `article-${Date.now().toString().slice(-6)}`
  }

  // 3. Filter out stop words (preserve numbers even if 1 digit e.g. "7 magnitude")
  const contentWords = rawWords.filter(w => {
    if (STOP_WORDS.has(w)) return false
    const isNumber = /^\d+$/.test(w)
    return w.length > 1 || isNumber
  })

  // 4. Select words: aim for 4 to 5 words
  let selectedWords: string[] = []

  if (contentWords.length >= minWords) {
    // We have enough meaningful content words! Take up to maxWords
    selectedWords = contentWords.slice(0, maxWords)
  } else if (contentWords.length > 0) {
    // If filtering stop words left fewer than minWords, backfill with non-stop-word-filtered
    // words from rawWords in order, avoiding trivial 1-letter words
    selectedWords = [...contentWords]
    for (const w of rawWords) {
      if (selectedWords.length >= maxWords) break
      if (!selectedWords.includes(w) && (w.length > 2 || /^\d+$/.test(w))) {
        selectedWords.push(w)
      }
    }
  } else {
    // Fallback if all words were stop words (e.g. "To be or not to be")
    selectedWords = rawWords.slice(0, maxWords)
  }

  // 5. Build slug and enforce character maxLength cleanly
  let candidate = selectedWords.join('-')

  if (candidate.length > maxLength) {
    // Trim word by word if over maxLength
    while (selectedWords.length > minWords && selectedWords.join('-').length > maxLength) {
      selectedWords.pop()
    }
    candidate = selectedWords.join('-')

    // If still too long, hard truncate at word boundary
    if (candidate.length > maxLength) {
      candidate = candidate.substring(0, maxLength)
      const lastHyphen = candidate.lastIndexOf('-')
      if (lastHyphen > 10) {
        candidate = candidate.substring(0, lastHyphen)
      }
    }
  }

  // Final sanity check using standard slugify
  const finalSlug = slugify(candidate)
  return finalSlug || `article-${Date.now().toString().slice(-6)}`
}

export interface ResolveUniqueSlugParams {
  payload?: any
  collection: string
  candidateSlug: string
  docId?: string | number | null
}

/**
 * Ensures the candidate slug is unique within the given collection.
 * If a document with this slug already exists (and is not docId),
 * automatically resolves collision by appending -2, -3, etc.
 */
export async function resolveUniqueSlug({
  payload,
  collection,
  candidateSlug,
  docId,
}: ResolveUniqueSlugParams): Promise<string> {
  let p = payload
  if (!p) {
    const { getPayloadClient } = await import('./payload')
    p = await getPayloadClient()
  }

  let slug = slugify(candidateSlug || '')

  if (!slug) {
    slug = `article-${Date.now().toString().slice(-6)}`
  }

  // Parse any existing trailing number from candidateSlug (e.g. "my-post-2" -> base: "my-post", counter: 2)
  const match = slug.match(/^(.*?)-(\d+)$/)
  let baseSlug = slug
  let counter = 1

  if (match && match[1] && match[2]) {
    baseSlug = match[1]
    counter = parseInt(match[2], 10)
  }

  let currentSlug = slug
  let isUnique = false
  let attempts = 0

  while (!isUnique && attempts < 100) {
    const where: any = {
      slug: { equals: currentSlug },
    }

    if (docId !== undefined && docId !== null) {
      where.id = { not_equals: docId }
    }

    const existing = await p.find({
      collection,
      where,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      isUnique = true
      return currentSlug
    }

    attempts++
    counter++
    currentSlug = `${baseSlug}-${counter}`
  }

  // Fallback if 100 collisions
  return `${baseSlug}-${Date.now().toString().slice(-5)}`
}
