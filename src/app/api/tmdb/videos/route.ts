import { NextResponse } from 'next/server'
import { getMovieVideos, getTvVideos, hasTmdbApiKey } from '@/lib/tmdb'

export const dynamic = 'force-dynamic';

const JSON_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
}

export async function GET(req: Request) {
  try {
    // If TMDB API key isn't configured, return empty list (dev mode/fallback)
    if (!hasTmdbApiKey()) {
      return NextResponse.json([], { status: 200, headers: JSON_CACHE_HEADERS })
    }
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const type = url.searchParams.get('type')

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    const numericId = Number(id)
    if (!Number.isSafeInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    if (type !== 'movie' && type !== 'tv') {
      return NextResponse.json({ error: 'Type must be movie or tv' }, { status: 400 })
    }

    let videos
    if (type === 'movie') {
      videos = await getMovieVideos(numericId)
    } else {
      videos = await getTvVideos(numericId)
    }

    return NextResponse.json(videos, { headers: JSON_CACHE_HEADERS })
  } catch (err) {
    console.error('TMDB videos API error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
