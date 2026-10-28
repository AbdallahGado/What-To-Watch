'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MediaCardLink } from './MediaCardLink';
import type { TMDBMedia } from '@/lib/tmdb-types';

interface MediaGridProps {
  items: TMDBMedia[];
  isLoading?: boolean;
}

const SkeletonLoader = ({ count = 10 }: { count?: number }) => (
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
);

function MediaCardItem({ item, index }: { item: TMDBMedia; index: number }) {
  return (
    <motion.div
      layout
      key={item.id}
      custom={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
    >
      <MediaCardLink item={item} />
    </motion.div>
  );
}

export function MediaGrid({ items, isLoading }: MediaGridProps) {
  return (
    <div
      id="media-grid"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6"
      role="region"
      aria-label="Media grid"
      aria-busy={Boolean(isLoading)}
    >
      <AnimatePresence>
        {isLoading ? (
          <SkeletonLoader count={10} />
        ) : items.length > 0 ? (
          items.map((item, i) => <MediaCardItem key={item.id} item={item} index={i} />)
        ) : (
          <div className="col-span-full text-center py-12 text-white/40">No items found</div>
        )}
      </AnimatePresence>
    </div>
  );
}
