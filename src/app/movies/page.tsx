
'use client';

import { Navbar } from '@/app/components/Navbar';
import { MediaGrid } from '@/app/components/MediaGrid';
import { FilterBar } from '@/app/components/FilterBar';
import { Pagination } from '@/app/components/Pagination';
import { useMediaListing } from '@/hooks/useMediaListing';

const GENRES = [
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '14', label: 'Fantasy' },
  { id: '36', label: 'History' },
  { id: '27', label: 'Horror' },
  { id: '10402', label: 'Music' },
  { id: '9648', label: 'Mystery' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
  { id: '10752', label: 'War' },
  { id: '37', label: 'Western' },
];

const SORT_OPTIONS = [
    { id: 'popularity.desc', label: 'Popular' },
    { id: 'vote_average.desc', label: 'Top Rated' },
    { id: 'primary_release_date.desc', label: 'Newest' },
];

export default function MoviesPage() {
  const {
    activeGenre,
    activeSort,
    currentPage,
    items: movies,
    isLoading,
    error,
    retry,
    setActiveGenre,
    setActiveSort,
    setCurrentPage
  } = useMediaListing({ type: 'movie' });

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="movies" />
      
      <main id="main-content" tabIndex={-1} className="pt-32 px-6 max-w-7xl mx-auto relative overflow-x-clip">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mb-16">
             <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                Movies
             </h1>
             <p className="text-white/70 max-w-2xl text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
                Discover the latest blockbusters, timeless classics, and hidden gems. 
                Filter by your favorite genre or sort to find exactly what you need.
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

        <MediaGrid items={movies} isLoading={isLoading} />
        
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}
