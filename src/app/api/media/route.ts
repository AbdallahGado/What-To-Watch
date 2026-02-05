import { NextResponse } from 'next/server';
import { getDiscoverMovies, getDiscoverTv } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? 'movie';
    const genre = searchParams.get('genre') ?? 'all';
    const sort = searchParams.get('sort') ?? 'popularity.desc';
    const page = Number(searchParams.get('page') ?? '1');

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

    const results =
      type === 'tv'
        ? await getDiscoverTv(genre, sort, safePage)
        : await getDiscoverMovies(genre, sort, safePage);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
