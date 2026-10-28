'use client';

import { Navbar } from '@/app/components/Navbar';
import { useWatchlistStore } from '@/features/watchlist/store';
import { MediaGrid } from '@/app/components/MediaGrid';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Film, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CollectionPage() {
  const { items } = useWatchlistStore();
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mediaItems = useMemo<TMDBMedia[]>(
    () =>
      Object.values(items).map((item) => ({
        id: item.id,
        media_type: item.mediaType,
        title: item.title,
        name: item.title,
        poster_path: item.posterPath,
        overview: '',
        backdrop_path: null,
        vote_average: 0,
        release_date: item.year ? `${item.year}-01-01` : undefined,
        first_air_date: item.year ? `${item.year}-01-01` : undefined
      })),
    [items]
  );

  const totalCount = mediaItems.length;
  const movieCount = mediaItems.filter(item => item.media_type === 'movie').length;
  const seriesCount = mediaItems.filter(item => item.media_type === 'tv').length;

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return mediaItems.filter(item => {
      const matchesFilter = filter === 'all' || item.media_type === filter;
      const title = (item.title || item.name || '').toLowerCase();
      const matchesQuery = normalizedQuery ? title.includes(normalizedQuery) : true;
      return matchesFilter && matchesQuery;
    });
  }, [filter, mediaItems, query]);

  const hasItems = totalCount > 0;
  const emptyMessage = query.trim()
    ? `No matches for "${query.trim()}".`
    : 'Your collection is waiting for its first pick.';

  return (
    <div className="relative min-h-screen bg-background text-white pb-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-10 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[28rem] -translate-x-1/2 rounded-full bg-white/5 blur-[140px]" />
      </div>
      <Navbar activeView="list" />
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-28 px-6 max-w-7xl mx-auto min-h-[60vh]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
              Collection
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light">My Collection</h1>
              <p className="text-white/60 text-base sm:text-lg font-light max-w-2xl">
                Your personal library of movies and series you want to watch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                {totalCount} total
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                {movieCount} movies
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                {seriesCount} series
              </span>
            </div>
          </div>

          <div className="w-full md:w-[360px] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your collection..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
                aria-label="Search collection"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'movie', label: 'Movies' },
                { id: 'tv', label: 'Series' }
              ].map(option => {
                const isActive = filter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilter(option.id as 'all' | 'movie' | 'tv')}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-background'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isMounted ? (
            hasItems ? (
                filteredItems.length > 0 ? (
                  <MediaGrid items={filteredItems} />
                ) : (
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-3xl bg-white/5"
                  >
                      <Film className="w-10 h-10 text-white/40 mb-4" aria-hidden="true" />
                      <h3 className="text-xl font-medium text-white mb-2">Nothing here yet</h3>
                      <p className="text-white/50 mb-8 max-w-sm text-center">
                        {emptyMessage}
                      </p>
                  </motion.div>
                )
            ) : (
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5"
              >
                  <Film className="w-10 h-10 text-white/40 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-medium text-white mb-2">Build your library</h3>
                  <p className="text-white/50 mb-8 max-w-sm text-center">
                    Tap the &ldquo;Add to List&rdquo; button on any movie or show to save it here.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/movies"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                    >
                      <Compass className="h-4 w-4" aria-hidden="true" />
                      Browse movies
                    </Link>
                    <Link
                      href="/what-to-watch"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Find a match
                    </Link>
                  </div>
              </motion.div>
            )
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
                 {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-full aspect-[2/3] bg-white/5 rounded-3xl animate-pulse" />
                 ))}
            </div>
        )}
      </main>
    </div>
  );
}
