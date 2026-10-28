'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Something went wrong</p>
        <h1 className="text-3xl md:text-4xl font-display font-light">We hit a snag</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          An unexpected error stopped this page from loading. You can try again or head back to Discover.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-3 rounded-2xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    </div>
  );
}
