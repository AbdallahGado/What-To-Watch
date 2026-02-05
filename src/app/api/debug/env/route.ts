import { NextResponse } from 'next/server';

export async function GET() {
  const raw = process.env.TMDB_API_KEY ?? null;
  const masked = raw ? `${raw.slice(0, 4)}...${raw.slice(-4)}` : null;
  return NextResponse.json({ tmdbSet: !!raw, tmdbMasked: masked });
}
