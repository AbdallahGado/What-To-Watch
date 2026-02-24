'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { Hero } from '@/app/components/Hero';
import { getMediaHref, getMediaTitle } from '@/lib/media';

interface HeroCarouselProps {
  items: TMDBMedia[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-rotate hero
  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % items.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [items.length]);

  const hero = items[heroIndex];

  if (!hero) return null;

  return (
    <div className="relative group">
      <Hero
        key={hero.id}
        content={{
          id: String(hero.id),
          media_type: hero.media_type,
          title: getMediaTitle(hero),
          overview: hero.overview,
          backdrop: hero.backdrop_path,
          poster: hero.poster_path
        }}
        primaryCta={getMediaHref(hero)}
        onWhatToWatch={() => router.push('/what-to-watch')}
      />

      {/* Carousel Indicators */}
      <div className="absolute bottom-32 md:bottom-20 right-12 flex gap-2 z-20">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${getMediaTitle(item)} hero`}
            onClick={() => setHeroIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
