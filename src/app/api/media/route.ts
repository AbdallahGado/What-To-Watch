import { NextResponse } from 'next/server';
import { getDiscoverMovies, getDiscoverTv } from '@/lib/tmdb';
import { MediaQueryError, parseMediaQuery } from '@/lib/media-query';

const JSON_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
};

export async function GET(request: Request) {
  try {
    const params = parseMediaQuery(new URL(request.url).searchParams);

    const results =
      params.type === 'tv'
        ? await getDiscoverTv(params.genre, params.sort, params.page)
        : await getDiscoverMovies(params.genre, params.sort, params.page);

    return NextResponse.json(results, { headers: JSON_CACHE_HEADERS });
  } catch (error) {
    if (error instanceof MediaQueryError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Media API error', error);
    return NextResponse.json({ error: 'Unable to load media right now.' }, { status: 500 });
  }
}
