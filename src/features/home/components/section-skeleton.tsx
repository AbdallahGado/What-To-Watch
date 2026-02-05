import React from 'react';

export function SectionSkeleton({ title, isCircle = false }: { title: string; isCircle?: boolean }) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-6 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-full mb-8" />
      <div className="flex gap-6 overflow-x-hidden pb-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 bg-white/5 ${
              isCircle 
                ? 'w-32 h-32 rounded-full' 
                : 'w-[220px] aspect-[2/3] rounded-3xl'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
