import { NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? '';

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const results = await searchMulti(query.trim());
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
