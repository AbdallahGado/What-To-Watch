
'use client';

import { Navbar } from '@/app/components/Navbar';
import { MediaGrid } from '@/app/components/MediaGrid';
import { FilterBar } from '@/app/components/FilterBar';
import { Pagination } from '@/app/components/Pagination';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { useState, useEffect } from 'react';
import { TMDBMedia } from '@/lib/tmdb';

const GENRES = [
  { id: '10759', label: 'Action & Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '10762', label: 'Kids' },
  { id: '9648', label: 'Mystery' },
  { id: '10763', label: 'News' },
  { id: '10764', label: 'Reality' },
  { id: '10765', label: 'Sci-Fi & Fantasy' },
  { id: '10766', label: 'Soap' },
  { id: '10767', label: 'Talk' },
  { id: '10768', label: 'War & Politics' },
  { id: '37', label: 'Western' },
];

const SORT_OPTIONS = [
    { id: 'popularity.desc', label: 'Popular' },
    { id: 'vote_average.desc', label: 'Top Rated' },
    { id: 'first_air_date.desc', label: 'Newest' },
];

export default function SeriesPage() {
  const [activeGenre, setActiveGenre] = useState('all');
  const [activeSort, setActiveSort] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [series, setSeries] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page when filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeGenre, activeSort]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/media?type=tv&genre=${encodeURIComponent(activeGenre)}&sort=${encodeURIComponent(activeSort)}&page=${currentPage}`
        );
        const data = (await response.json()) as TMDBMedia[];
        setTimeout(() => {
             setSeries(data);
             setIsLoading(false);
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load series');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeGenre, activeSort, currentPage]);

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="series" />
      
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
             <h1 className="text-5xl font-display font-light mb-4">Series</h1>
             <p className="text-white/50 max-w-2xl text-lg font-light">
                Binge-worthy TV shows from around the globe. 
                Find your next obsession, from Korean dramas to American sitcoms.
             </p>
        </div>

        <FilterBar
            genres={GENRES}
            sortOptions={SORT_OPTIONS}
            activeGenre={activeGenre}
            activeSort={activeSort}
            onGenreChange={setActiveGenre}
            onSortChange={setActiveSort}
        />

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <MediaGrid items={series} isLoading={isLoading} />
        
        <Pagination 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
