import { useEffect, useState } from 'react';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { parseMediaResults } from '@/lib/media-query';

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
  const [retryCount, setRetryCount] = useState(0);

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
          const body: unknown = await response.json().catch(() => null);
          const message =
            typeof body === 'object' &&
            body !== null &&
            'error' in body &&
            typeof body.error === 'string'
              ? body.error
              : `Failed to load ${type}. Please try again.`;
          throw new Error(message);
        }
        const data = parseMediaResults(await response.json());
        if (controller.signal.aborted) return;
        setItems(data);
        setIsLoading(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : `Failed to load ${type}`;
        setError(message);
        setItems([]);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [activeGenre, activeSort, currentPage, retryCount, type]);

  return {
    activeGenre,
    activeSort,
    currentPage,
    items,
    isLoading,
    error,
    retry: () => setRetryCount((count) => count + 1),
    setActiveGenre,
    setActiveSort,
    setCurrentPage
  };
}
