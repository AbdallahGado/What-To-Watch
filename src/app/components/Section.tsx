'use client';

import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children?: ReactNode;
  items?: any[];
  renderItem?: (item: any) => ReactNode;
}

export const Section = ({ title, children, items, renderItem }: SectionProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between group">
        <h2 className="text-2xl md:text-3xl font-light text-white flex items-center gap-3 tracking-wide">
          {title}
        </h2>
        
        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
      </div>
      
      <div className="relative group/section">
        {/* Left Fade Mask */}
         <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
         
         {/* Right Fade Mask */}
         <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div ref={scrollRef} className="overflow-x-auto hide-scrollbar pb-12 px-6 -mx-6 scroll-smooth">
          <div className="flex gap-6 px-6 max-w-7xl mx-auto">
            {children || (items && items.length > 0 && items.map((item, idx) => (
              <div key={item.id ?? idx} className="flex-shrink-0 w-48">
                {renderItem?.(item)}
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};
