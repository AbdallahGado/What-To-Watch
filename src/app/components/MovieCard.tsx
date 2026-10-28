'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookmarkPlus, Check, Star } from 'lucide-react';
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
  href?: string;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
  variant?: 'portrait' | 'landscape';
  priority?: boolean;
}

const MovieCardComponent = ({
  content,
  tmdb,
  onClick,
  href,
  isInWatchlist = false,
  onToggleWatchlist,
  variant = 'portrait',
  priority = false,
}: MovieCardProps) => {
  const title = content?.title ?? tmdb?.title ?? '';
  const rating = content?.rating ?? tmdb?.vote_average ?? 0;
  const year = content?.year ?? tmdb?.year ?? '';
  const isInteractive = Boolean(onClick);
  const ratingLabel = rating > 0 ? rating.toFixed(1) : 'NR';

  const imageUrl = getPosterUrl(content?.poster ?? tmdb?.poster_path ?? null, 'w500');

  const sizeClass = variant === 'portrait' ? 'w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px]' : 'w-full max-w-[300px] md:max-w-[380px]';
  const aspectClass = variant === 'portrait' ? 'aspect-[2/3]' : 'aspect-video';
  const sizes =
    variant === 'portrait'
      ? '(max-width: 768px) 45vw, (max-width: 1200px) 22vw, 220px'
      : '(max-width: 768px) 80vw, 380px';

  return (
    <div
      className={`relative group flex-shrink-0 ${sizeClass} ${
        isInteractive
          ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          : ''
      }`}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={isInteractive ? `${title} - Rating: ${ratingLabel}` : undefined}
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 shadow-2xl shadow-black/80 transition-all duration-300 ease-out group-hover:border-white/15 group-hover:shadow-brand-900/40 group-hover:shadow-3xl ${aspectClass} transform-gpu group-hover:-translate-y-2 will-change-transform`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80 z-10" />
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

        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white z-20">
          <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" aria-hidden="true" />
          <span>{ratingLabel}</span>
        </div>

        {href && (
          <Link
            href={href}
            aria-label={`View details for ${title}`}
            className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          />
        )}

        {onToggleWatchlist && (
          <button
            type="button"
            onClick={onToggleWatchlist}
            aria-label={isInWatchlist ? `Remove ${title} from watchlist` : `Save ${title} to watchlist`}
            aria-pressed={isInWatchlist}
            className={`absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              isInWatchlist
                ? 'border-brand-200/40 bg-brand-500/90 text-white'
                : 'border-white/20 bg-black/65 text-white/90 hover:border-white/40 hover:bg-black/85'
            }`}
          >
            {isInWatchlist ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <div className="mt-4 min-h-[3.25rem]">
        <div className="flex items-start gap-2">
          {href ? (
            <Link
              href={href}
              className="min-w-0 flex-1 rounded-sm text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <h3 className="text-sm font-medium leading-snug tracking-wide line-clamp-2 md:text-base">
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="min-w-0 flex-1 text-sm font-medium leading-snug tracking-wide text-white/90 line-clamp-2 md:text-base">
              {title}
            </h3>
          )}
          {year && (
            <span className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/55">
              {year}
            </span>
          )}
        </div>
        <div className="mt-1.5 h-4 flex items-center text-[10px] sm:text-[11px] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 uppercase tracking-[0.2em] transform translate-y-1 group-hover:translate-y-0">
          <span className="text-white/40">Details</span>
          <span className="mx-2 text-white/20">•</span>
          <span className="text-brand-400">Open</span>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const MovieCard = memo(MovieCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.content?.id === nextProps.content?.id &&
    prevProps.content?.title === nextProps.content?.title &&
    prevProps.content?.poster === nextProps.content?.poster &&
    prevProps.content?.rating === nextProps.content?.rating &&
    prevProps.content?.year === nextProps.content?.year &&
    prevProps.tmdb?.id === nextProps.tmdb?.id &&
    prevProps.tmdb?.title === nextProps.tmdb?.title &&
    prevProps.tmdb?.poster_path === nextProps.tmdb?.poster_path &&
    prevProps.tmdb?.vote_average === nextProps.tmdb?.vote_average &&
    prevProps.tmdb?.year === nextProps.tmdb?.year &&
    prevProps.href === nextProps.href &&
    prevProps.isInWatchlist === nextProps.isInWatchlist &&
    prevProps.onToggleWatchlist === nextProps.onToggleWatchlist &&
    prevProps.variant === nextProps.variant &&
    prevProps.priority === nextProps.priority &&
    prevProps.onClick === nextProps.onClick
  );
});
