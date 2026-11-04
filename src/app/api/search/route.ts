import { NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

const JSON_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? '';

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Search query must be 100 characters or fewer.' },
        { status: 400 }
      );
    }

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json([], { headers: JSON_CACHE_HEADERS });
    }

    const results = await searchMulti(query.trim());
    return NextResponse.json(results, { headers: JSON_CACHE_HEADERS });
  } catch (error) {
    console.error('TMDB multi-search failed', error);
    return NextResponse.json(
      { error: 'Search is temporarily unavailable.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
