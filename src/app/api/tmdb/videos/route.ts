import { NextResponse } from 'next/server'
import { getMovieVideos, getTvVideos } from '@/lib/tmdb'

// Ensure data is JSON serializable by converting to plain object
function sanitize(data: any): any {
  if (data === null || data === undefined) return data
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return data
  if (Array.isArray(data)) return data.map(sanitize)
  if (typeof data === 'object') {
    const result: Record<string, any> = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const val = data[key]
        // Skip functions and symbols
        if (typeof val !== 'function' && typeof val !== 'symbol') {
          result[key] = sanitize(val)
        }
      }
    }
    return result
  }
  return undefined
}

export async function GET(req: Request) {
  try {
    // If TMDB API key isn't configured, return empty list (dev mode/fallback)
    if (!process.env.TMDB_API_KEY) {
      return NextResponse.json([], { status: 200 })
    }
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const type = url.searchParams.get('type')

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    let videos
    if (type === 'movie') {
      videos = await getMovieVideos(numericId)
    } else {
      videos = await getTvVideos(numericId)
    }

    // Ensure the response is JSON serializable. Try stringify/parse as a safety step.
    try {
      const safe = sanitize(videos)
      const body = JSON.parse(JSON.stringify(safe))
      return NextResponse.json(body)
    } catch (serErr) {
      console.error('TMDB videos serialization error', serErr, { videos })
      return NextResponse.json([], { status: 200 })
    }
  } catch (err) {
    console.error('TMDB videos API error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
