import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedArticles } from '@/lib/api-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('search') || undefined
    const isFeaturedParam = searchParams.get('isFeatured')
    const isBreakingParam = searchParams.get('isBreaking')

    const isFeatured = isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined
    const isBreaking = isBreakingParam !== null ? isBreakingParam === 'true' : undefined

    const result = await getPaginatedArticles({
      page: Math.max(1, isNaN(page) ? 1 : page),
      limit: Math.min(100, Math.max(1, isNaN(limit) ? 12 : limit)),
      search,
      isFeatured,
      isBreaking,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in /api/articles GET:', error)
    return NextResponse.json(
      {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page: 1,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
        error: 'Failed to fetch articles',
      },
      { status: 500 }
    )
  }
}
