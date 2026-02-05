
'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

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
  ({ option, isActive, onClick, label }: { option: FilterOption; isActive: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
        isActive
          ? 'bg-brand-500/10 border-brand-500 text-brand-300 shadow-[0_0_15px_-5px_var(--color-brand-500)]'
          : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'
      }`}
      type="button"
      aria-pressed={isActive}
      aria-label={`Filter by ${label}`}
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
  onSortChange
}: FilterBarProps) => {
  const handleAllGenres = useCallback(() => onGenreChange('all'), [onGenreChange]);
  const handleSortChange = useCallback((id: string) => () => onSortChange(id), [onSortChange]);

  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* Genres - Horizontal Scroll */}
      <div className="overflow-x-auto hide-scrollbar -mx-6 px-6">
        <div className="flex gap-3 pb-2">
          <button
            onClick={handleAllGenres}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeGenre === 'all'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
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
              label="genre"
            />
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-end border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">Sort By</span>
          <div className="flex bg-[#1e2128] rounded-lg p-1 border border-white/5">
            {sortOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSortChange(opt.id)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSort === opt.id 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-white/40 hover:text-white/70'
                }`}
                type="button"
                aria-pressed={activeSort === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterBarComponent.displayName = 'FilterBar';

export const FilterBar = memo(FilterBarComponent);
