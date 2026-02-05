'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clapperboard, Monitor, Star } from 'lucide-react';
import { TMDBMedia } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';

// Custom debounce hook for optimized search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoized search result item
const SearchResultItem = memo(({ item, index, onClose }: { item: TMDBMedia; index: number; onClose: () => void }) => {
  const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href} onClick={onClose} className="group block space-y-3">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-white/5">
          {item.poster_path ? (
            <Image 
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
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
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 500);

  // Handle overlay visibility
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = (await response.json()) as TMDBMedia[];
        // Filter to only items with posters for better visual results
        setResults(data.filter(item => item.poster_path));
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleClose = useCallback(onClose, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center" onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-labelledby="search-title">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            aria-hidden="true"
          />
          
          {/* Content Container */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl px-6 pt-12 md:pt-24 flex flex-col h-full"
          >
            {/* Search Header */}
            <div className="flex items-center gap-6 mb-12">
              <Search className="w-8 h-8 text-white/50 flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="flex-1 bg-transparent border-none outline-none text-3xl md:text-5xl font-display font-light placeholder-white/20 text-white"
                aria-label="Search for movies and TV shows"
                id="search-title"
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
              ) : query.trim() ? (
                <div className="text-center py-20">
                  <div className="text-white/30 text-xl font-light">No results found for "{query}"</div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-white/20 text-lg font-light">Start typing to explore...</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

SearchOverlayComponent.displayName = 'SearchOverlay';

export const SearchOverlay = memo(SearchOverlayComponent);

