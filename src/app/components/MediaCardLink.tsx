'use client';

import { MovieCard } from '@/app/components/MovieCard';
import { useWatchlistStore } from '@/features/watchlist/store';
import { getMediaHref, getMediaTitle, getMediaYear, toCardData } from '@/lib/media';
import type { TMDBMedia } from '@/lib/tmdb-types';

interface MediaCardLinkProps {
  item: TMDBMedia;
  priority?: boolean;
  className?: string;
}

export function MediaCardLink({ item, priority = false, className = '' }: MediaCardLinkProps) {
  const mediaType = item.media_type ?? 'movie';
  const title = getMediaTitle(item);
  const isSaved = useWatchlistStore((state) =>
    Boolean(state.items[`${mediaType}:${item.id}`])
  );
  const toggle = useWatchlistStore((state) => state.toggle);

  const handleToggle = () => {
    toggle({
      id: item.id,
      mediaType,
      title,
      posterPath: item.poster_path,
      year: getMediaYear(item),
    });
  };

  return (
    <div className={`group/media-card relative w-[180px] shrink-0 md:w-[220px] ${className}`}>
      <MovieCard
        tmdb={toCardData(item)}
        variant="portrait"
        priority={priority}
        href={getMediaHref(item)}
        isInWatchlist={isSaved}
        onToggleWatchlist={handleToggle}
      />
    </div>
  );
}
