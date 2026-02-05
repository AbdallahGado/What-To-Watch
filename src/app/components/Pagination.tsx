
'use client';

import { memo, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

const PaginationComponent = ({ currentPage, onPageChange, totalPages = 50 }: PaginationProps) => {
  const getPageNumbers = useCallback(() => {
    const pages = [];
    // Show limited range around current page for simplicity
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, onPageChange, totalPages]);

  const handlePageClick = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8" role="navigation" aria-label="Pagination">
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="p-2 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed"
        aria-label="Previous page"
        type="button"
      >
        <ChevronLeft className="w-5 h-5 text-white" aria-hidden="true" />
      </button>

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
            currentPage === page 
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-110' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          aria-pressed={currentPage === page}
          aria-label={`Go to page ${page}`}
          type="button"
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed"
        aria-label="Next page"
        type="button"
      >
        <ChevronRight className="w-5 h-5 text-white" aria-hidden="true" />
      </button>
    </div>
  );
};

PaginationComponent.displayName = 'Pagination';

export const Pagination = memo(PaginationComponent);
