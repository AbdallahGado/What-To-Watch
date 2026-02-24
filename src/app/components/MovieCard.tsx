'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getPosterUrl } from '@/lib/tmdb-images';

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
  priority?: boolean;
}

const MovieCardComponent = ({ content, tmdb, onClick, variant = 'portrait', priority = false }: MovieCardProps) => {
  const title = content?.title ?? tmdb?.title ?? '';
  const rating = content?.rating ?? tmdb?.vote_average ?? 0;
  const year = content?.year ?? tmdb?.year ?? '';
  const isInteractive = Boolean(onClick);
  const ratingLabel = rating > 0 ? rating.toFixed(1) : 'NR';

  const imageUrl = getPosterUrl(content?.poster ?? tmdb?.poster_path ?? null, 'w500');

  const sizeClass = variant === 'portrait' ? 'w-[180px] md:w-[220px]' : 'w-[300px] md:w-[380px]';
  const aspectClass = variant === 'portrait' ? 'aspect-[2/3]' : 'aspect-video';
  const sizes =
    variant === 'portrait'
      ? '(max-width: 768px) 45vw, (max-width: 1200px) 22vw, 220px'
      : '(max-width: 768px) 80vw, 380px';

  return (
    <div
      className={`relative group flex-shrink-0 ${sizeClass} ${isInteractive ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      aria-label={isInteractive ? `${title} - Rating: ${ratingLabel}` : undefined}
    >
      <div
        className={`relative overflow-hidden rounded-[26px] bg-slate-900/80 border border-white/10 shadow-xl shadow-black/50 transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-black/70 ${aspectClass} transform-gpu group-hover:-translate-y-1 will-change-transform`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 opacity-80" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01] opacity-95 group-hover:opacity-100 transform-gpu"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/40 text-sm">
            No Image Available
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/65 border border-white/10 px-2.5 py-1 text-[11px] text-white/90">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span>{ratingLabel}</span>
        </div>
        {year && (
          <div className="absolute top-3 right-3 rounded-full bg-black/65 border border-white/10 px-2.5 py-1 text-[11px] text-white/80">
            {year}
          </div>
        )}

      </div>

      <div className="mt-3 min-h-[3.25rem]">
        <h3 className="text-white font-medium text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>
        <div className="mt-1 h-4 text-[11px] text-white/70 font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="uppercase tracking-[0.2em] text-white/50">Details</span>
          <span className="mx-2 text-white/30">•</span>
          <span className="text-white/70">Open</span>
        </div>
      </div>
    </div>
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
