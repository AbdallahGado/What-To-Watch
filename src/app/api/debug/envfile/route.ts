import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), '.env.local');
    const raw = fs.readFileSync(p, 'utf8');
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const masked = lines.map((l) => {
      if (l.startsWith('TMDB_API_KEY=')) {
        const v = l.split('=')[1] ?? '';
        const clean = v.replace(/"/g, '');
        if (!clean) return 'TMDB_API_KEY=<<EMPTY>>';
        return `TMDB_API_KEY=${clean.slice(0,4)}...${clean.slice(-4)}`;
      }
      return l;
    });
    return NextResponse.json({ found: true, path: p, lines: masked });
  } catch (e: any) {
    return NextResponse.json({ found: false, error: String(e.message) }, { status: 500 });
  }
}
