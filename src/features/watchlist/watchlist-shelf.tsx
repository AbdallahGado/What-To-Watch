'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, Clapperboard, Sparkles } from 'lucide-react';
import { Section } from '@/app/components/Section';
import { MediaCardLink } from '@/app/components/MediaCardLink';
import { useWatchlistStore } from '@/features/watchlist/store';
import type { TMDBMedia } from '@/lib/tmdb-types';

export function WatchlistShelf() {
  const savedItems = useWatchlistStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const items = useMemo(
    () =>
      Object.values(savedItems)
        .slice()
        .reverse()
        .map<TMDBMedia>((item) => ({
          id: item.id,
          media_type: item.mediaType,
          title: item.title,
          name: item.title,
          overview: '',
          poster_path: item.posterPath,
          backdrop_path: null,
          vote_average: 0,
          release_date: item.mediaType === 'movie' && item.year ? `${item.year}-01-01` : undefined,
          first_air_date: item.mediaType === 'tv' && item.year ? `${item.year}-01-01` : undefined,
        })),
    [savedItems]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <section
        className="mx-auto max-w-7xl px-6 py-8 md:py-10"
        aria-labelledby="watchlist-shelf-title"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/[0.12] via-white/[0.035] to-accent-500/[0.08] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-brand-200">
              <Bookmark className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-200/75">
                Keep the good ones close
              </p>
              <h2 id="watchlist-shelf-title" className="font-display text-2xl text-white md:text-3xl">
                Your watchlist starts here
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                Save movies and series as you browse, then come back when it is time to press play.
              </p>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
              Browse movies
            </Link>
            <Link
              href="/what-to-watch"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Find a match
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Section
      title="Pick up where you left off"
      eyebrow={`${items.length} saved ${items.length === 1 ? 'title' : 'titles'}`}
      description="Your personal shortlist, ready whenever you are."
      href="/collection"
    >
      {items.slice(0, 10).map((item) => (
        <MediaCardLink key={`${item.media_type}:${item.id}`} item={item} />
      ))}
      <Link
        href="/collection"
        className="flex w-36 shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.025] px-5 text-center text-sm font-medium text-white/65 transition-colors hover:border-brand-300/40 hover:bg-brand-500/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 md:w-44"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </span>
        See your full collection
      </Link>
    </Section>
  );
}
