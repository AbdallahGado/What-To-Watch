import { NextResponse } from 'next/server';

// Development middleware: allow Next.js to handle rendering.
// Previously this returned an empty Response which prevented the
// app from rendering any HTML. Return NextResponse.next() so
// requests continue to the Next.js handlers.
export function middleware(req: Request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
