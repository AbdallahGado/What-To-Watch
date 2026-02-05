'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TMDBCardData {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  year?: string | number;
}

interface MovieCardProps {
  content?: {
    id: string | number;
    title: string;
    poster: string;
    backdrop: string;
    rating: number;
    year: string | number;
  };
  tmdb?: TMDBCardData;
  onClick?: () => void;
  variant?: 'portrait' | 'landscape';
}

const MovieCardComponent = ({ content, tmdb, onClick, variant = 'portrait' }: MovieCardProps) => {
  const title = content?.title ?? tmdb?.title ?? '';
  const rating = content?.rating ?? tmdb?.vote_average ?? 0;
  const year = content?.year ?? tmdb?.year ?? '';

  function makeImageUrl(path?: string | null) {
    if (!path) return undefined;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // TMDB poster paths
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  const imageUrl = makeImageUrl(content?.poster ?? tmdb?.poster_path ?? null);

  const sizeClass = variant === 'portrait' ? 'w-[180px] md:w-[220px]' : 'w-[300px] md:w-[380px]';
  const aspectClass = variant === 'portrait' ? 'aspect-[2/3]' : 'aspect-video';

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative group cursor-pointer flex-shrink-0 ${sizeClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`${title} - Rating: ${rating.toFixed(1)}`}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 transition-all duration-300 group-hover:border-white/10 ${aspectClass}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/40 text-sm">
            No Image Available
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-medium text-sm md:text-base leading-tight mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between text-[10px] text-white/70 font-medium">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-white">{rating.toFixed(1)}</span>
            </span>
            <span>{year}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const MovieCard = memo(MovieCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.content?.id === nextProps.content?.id &&
    prevProps.tmdb?.id === nextProps.tmdb?.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.onClick === nextProps.onClick
  );
});
