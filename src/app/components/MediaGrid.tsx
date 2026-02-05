
'use client';

import React, { Suspense, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { TMDBMedia } from '@/lib/tmdb';
import Link from 'next/link';

interface MediaGridProps {
  items: TMDBMedia[];
  isLoading?: boolean;
}

// Memoized skeleton loader
const SkeletonLoader = memo(({ count = 10 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full aspect-[2/3] bg-white/5 rounded-3xl animate-pulse"
        aria-hidden="true"
      />
    ))}
  </>
));

SkeletonLoader.displayName = 'SkeletonLoader';

// Memoized media card wrapper
const MediaCardItem = memo(({ item, index }: { item: TMDBMedia; index: number }) => {
  const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  
  const cardData = useMemo(
    () => ({
      id: item.id,
      title: item.title ?? item.name ?? '',
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      year: (item.release_date ?? item.first_air_date)?.split('-')[0],
    }),
    [item]
  );

  return (
    <motion.div
      layout
      key={item.id}
      custom={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link 
        href={href} 
        className="block"
        aria-label={`View details for ${cardData.title}`}
      >
        <Suspense fallback={<div className="w-full aspect-[2/3] bg-white/5 rounded-3xl animate-pulse" />}>
          <MovieCard
            tmdb={cardData}
            variant="portrait"
          />
        </Suspense>
      </Link>
    </motion.div>
  );
});

MediaCardItem.displayName = 'MediaCardItem';

const MediaGridComponent = ({ items, isLoading }: MediaGridProps) => {
  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6"
      role="region"
      aria-label="Media grid"
      aria-busy={isLoading}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SkeletonLoader count={10} />
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <MediaCardItem key={item.id} item={item} index={i} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-white/40">
            No items found
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

MediaGridComponent.displayName = 'MediaGrid';

export const MediaGrid = memo(MediaGridComponent);
