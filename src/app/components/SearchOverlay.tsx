'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Clapperboard, Monitor, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { getPosterUrl } from '@/lib/tmdb-images';
import { getMediaHref } from '@/lib/media';
import { useDebounce } from '@/hooks/useDebounce';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoized search result item
const SearchResultItem = memo(({ item, index, onClose }: { item: TMDBMedia; index: number; onClose: () => void }) => {
  const href = getMediaHref(item);
  const posterUrl = getPosterUrl(item.poster_path, 'w500');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href} onClick={onClose} className="group block space-y-3">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-white/5">
          {posterUrl ? (
            <Image 
              src={posterUrl}
              alt={item.title || item.name || 'Poster'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 20vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-white font-medium truncate group-hover:text-brand-300 transition-colors">
            {item.title || item.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
            <span className="flex items-center gap-1">
              {item.media_type === 'tv' ? (
                <Monitor className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Clapperboard className="w-3 h-3" aria-hidden="true" />
              )}
              {item.media_type === 'tv' ? 'Series' : 'Movie'}
            </span>
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const SearchOverlayComponent = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const debouncedQuery = useDebounce(query, 500);
  useLockBodyScroll(isOpen);

  // Handle overlay visibility
  useEffect(() => {
    if (!isOpen) {
      previouslyFocusedRef.current?.focus();
      return;
    }

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    setQuery('');
    setResults([]);
    setIsLoading(false);
    setError(null);
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    const controller = new AbortController();

    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        const data = (await response.json()) as TMDBMedia[];
        // Filter to only items with posters for better visual results
        setResults(
          data.filter(
            (item) =>
              item.poster_path &&
              (item.media_type === 'movie' || item.media_type === 'tv' || !item.media_type)
          )
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Search failed:', error);
        setResults([]);
        setError('Search is unavailable right now. Please try again.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    performSearch();

    return () => controller.abort();
  }, [debouncedQuery, retryCount]);

  const handleClose = useCallback(onClose, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center"
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
          tabIndex={-1}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            aria-hidden="true"
          />
          
          {/* Content Container */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl px-6 pt-12 md:pt-24 flex flex-col h-full"
          >
            {/* Search Header */}
            <div className="flex items-center gap-6 mb-12">
              <Search className="w-8 h-8 text-white/50 flex-shrink-0" aria-hidden="true" />
              <h2 id="search-title" className="sr-only">Search movies and TV shows</h2>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="flex-1 bg-transparent border-none outline-none text-3xl md:text-5xl font-display font-light placeholder-white/20 text-white"
                aria-label="Search for movies and TV shows"
              />
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close search overlay"
                type="button"
              >
                <X className="w-8 h-8" aria-hidden="true" />
              </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
              {isLoading ? (
                <div className="text-white/30 text-center py-20 text-lg" role="status" aria-live="polite">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                  {results.map((item, index) => (
                    <SearchResultItem key={item.id} item={item} index={index} onClose={handleClose} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20" role="alert">
                  <p className="text-white/60 text-lg">{error}</p>
                  <button
                    type="button"
                    onClick={() => setRetryCount((count) => count + 1)}
                    className="mt-4 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    Try again
                  </button>
                </div>
              ) : query.trim() ? (
                <div className="text-center py-20">
                  <div className="text-white/30 text-xl font-light">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-white/20 text-lg font-light">Start typing to explore...</div>
                </div>
              )}
            </div>
          </motion.div>
    </motion.div>
  );
};

SearchOverlayComponent.displayName = 'SearchOverlay';

export const SearchOverlay = memo(SearchOverlayComponent);
