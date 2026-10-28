
'use client';

import { Navbar } from '@/app/components/Navbar';
import { MediaGrid } from '@/app/components/MediaGrid';
import { FilterBar } from '@/app/components/FilterBar';
import { Pagination } from '@/app/components/Pagination';
import { useMediaListing } from '@/hooks/useMediaListing';

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
  const {
    activeGenre,
    activeSort,
    currentPage,
    items: series,
    isLoading,
    error,
    retry,
    setActiveGenre,
    setActiveSort,
    setCurrentPage
  } = useMediaListing({ type: 'tv' });

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="series" />
      
      <main id="main-content" tabIndex={-1} className="pt-32 px-6 max-w-7xl mx-auto relative overflow-x-clip">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mb-16">
             <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                Series
             </h1>
             <p className="text-white/70 max-w-2xl text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
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
          <div className="text-center py-8" role="alert" aria-live="polite">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              type="button"
              onClick={retry}
              disabled={isLoading}
              className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              {isLoading ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        )}

        <MediaGrid items={series} isLoading={isLoading} />
        
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}
