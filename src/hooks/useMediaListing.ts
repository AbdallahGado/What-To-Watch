import { useEffect, useState } from 'react';
import type { TMDBMedia } from '@/lib/tmdb-types';

type MediaType = 'movie' | 'tv';

interface UseMediaListingOptions {
  type: MediaType;
  initialSort?: string;
}

export function useMediaListing({ type, initialSort = 'popularity.desc' }: UseMediaListingOptions) {
  const [activeGenre, setActiveGenre] = useState('all');
  const [activeSort, setActiveSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeGenre, activeSort]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/media?type=${type}&genre=${encodeURIComponent(activeGenre)}&sort=${encodeURIComponent(activeSort)}&page=${currentPage}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Failed to load ${type}`);
        }
        const data = (await response.json()) as TMDBMedia[];
        if (controller.signal.aborted) return;
        setItems(data);
        setIsLoading(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : `Failed to load ${type}`;
        setError(message);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [activeGenre, activeSort, currentPage, type]);

  return {
    activeGenre,
    activeSort,
    currentPage,
    items,
    isLoading,
    error,
    setActiveGenre,
    setActiveSort,
    setCurrentPage
  };
}
