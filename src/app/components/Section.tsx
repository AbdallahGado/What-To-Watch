'use client';

import React, { ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionProps<T> {
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  compact?: boolean;
  children?: ReactNode;
  items?: T[];
  renderItem?: (item: T) => ReactNode;
}

function SectionComponent<T>({ title, eyebrow, description, href, compact = false, children, items, renderItem }: SectionProps<T>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const titleId = `home-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={compact ? '' : 'py-8 md:py-10'}
    >
      <section aria-labelledby={titleId}>
        <div className="max-w-7xl mx-auto px-6 mb-5 md:mb-7 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-200/80">
                {eyebrow}
              </p>
            )}
            <h2 id={titleId} className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 max-w-xl text-sm text-white/45">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {href && (
              <Link
                href={href}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white/55 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                Explore all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
              className="p-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
              className="p-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative group/section">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

          <div ref={scrollRef} className={`overflow-x-auto hide-scrollbar ${compact ? 'pb-4' : 'pb-12'} px-6 -mx-6 scroll-smooth snap-x snap-mandatory`}>
            <div className="flex gap-6 md:gap-8 px-0 md:px-6 py-4 max-w-7xl mx-auto w-max">
              {children ||
                (items &&
                  items.length > 0 &&
                  items.map((item, idx) => (
                    <div
                      key={(item as { id?: string | number })?.id ?? idx}
                      className="flex-shrink-0 snap-start"
                    >
                      {renderItem?.(item)}
                    </div>
                  )))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const Section = memo(SectionComponent) as typeof SectionComponent;
