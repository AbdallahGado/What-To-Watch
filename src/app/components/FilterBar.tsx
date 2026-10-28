'use client';

import { memo, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  genres: FilterOption[];
  sortOptions: FilterOption[];
  activeGenre: string;
  activeSort: string;
  onGenreChange: (id: string) => void;
  onSortChange: (id: string) => void;
}

const FilterButtonComponent = memo(
  ({ option, isActive, onClick }: { option: FilterOption; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`min-h-10 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 border ${
        isActive
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 border-transparent'
          : 'glass-button text-white/70 hover:text-white border-white/10'
      }`}
      type="button"
      aria-pressed={isActive}
      aria-label={`Filter by ${option.label}`}
    >
      {option.label}
    </button>
  )
);

FilterButtonComponent.displayName = 'FilterButton';

const FilterBarComponent = ({
  genres,
  sortOptions,
  activeGenre,
  activeSort,
  onGenreChange,
  onSortChange,
}: FilterBarProps) => {
  const handleAllGenres = useCallback(() => onGenreChange('all'), [onGenreChange]);
  const selectedGenre = genres.find((genre) => genre.id === activeGenre);
  const defaultSort = sortOptions[0]?.id;
  const hasChangedFilters = activeGenre !== 'all' || activeSort !== defaultSort;

  const handleClearFilters = useCallback(() => {
    onGenreChange('all');
    if (defaultSort) onSortChange(defaultSort);
  }, [defaultSort, onGenreChange, onSortChange]);

  return (
    <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:mb-12 md:p-5">
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              Browse by genre
            </h2>
            <span className="text-xs text-white/35 sm:hidden">Swipe to explore</span>
          </div>
          <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
            <div className="flex w-max gap-2 pb-1">
              <button
                onClick={handleAllGenres}
                className={`min-h-10 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 border ${
                  activeGenre === 'all'
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 border-transparent'
                    : 'glass-button text-white/70 hover:text-white border-white/10'
                }`}
                type="button"
                aria-pressed={activeGenre === 'all'}
                aria-label="Show all genres"
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <FilterButtonComponent
                  key={genre.id}
                  option={genre}
                  isActive={activeGenre === genre.id}
                  onClick={() => onGenreChange(genre.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Sort by
            </span>
            <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
              <div className="flex w-max gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                    className={`min-h-9 rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                      activeSort === option.id
                        ? 'bg-brand-500/20 text-brand-200 shadow-sm'
                        : 'text-white/55 hover:bg-white/5 hover:text-white'
                    }`}
                    type="button"
                    aria-pressed={activeSort === option.id}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="min-w-0 truncate text-xs text-white/45" aria-live="polite">
              {selectedGenre ? `${selectedGenre.label} · ` : ''}
              {sortOptions.find((option) => option.id === activeSort)?.label ?? 'Popular'}
            </p>
            {hasChangedFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterBarComponent.displayName = 'FilterBar';

export const FilterBar = memo(FilterBarComponent);
