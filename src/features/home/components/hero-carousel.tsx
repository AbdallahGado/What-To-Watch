'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { Hero } from '@/app/components/Hero';
import { getMediaHref, getMediaTitle, getMediaYear } from '@/lib/media';
import { getPosterUrl } from '@/lib/tmdb-images';

interface HeroCarouselProps {
  items: TMDBMedia[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);

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
          poster: hero.poster_path,
          rating: hero.vote_average,
          year: getMediaYear(hero)
        }}
        primaryCta={getMediaHref(hero)}
        onWhatToWatch={() => router.push('/what-to-watch')}
      />

      {/* Featured-title selector */}
      {items.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 md:bottom-8 md:justify-end md:px-10">
          <div className="flex max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-black/55 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="hide-scrollbar flex max-w-[calc(100vw-5rem)] snap-x snap-mandatory gap-2 overflow-x-auto md:max-w-[min(62vw,660px)]">
              {items.map((item, idx) => {
                const title = getMediaTitle(item);
                const posterUrl = getPosterUrl(item.poster_path, 'w185');

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show featured ${item.media_type === 'tv' ? 'series' : 'movie'}: ${title}`}
                    aria-current={idx === heroIndex ? 'true' : undefined}
                    onClick={() => {
                      setHeroIndex(idx);
                    }}
                    className={`group/choice flex w-[136px] shrink-0 snap-start items-center gap-2.5 rounded-xl border p-1.5 text-left transition-colors md:w-[168px] ${
                      idx === heroIndex
                        ? 'border-brand-300/60 bg-brand-500/15'
                        : 'border-transparent bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.08]'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                  >
                    <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10 md:h-14 md:w-10">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white/40" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-white md:text-xs">
                        {title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] text-white/55">
                        <span>{item.media_type === 'tv' ? 'Series' : 'Movie'}</span>
                        {item.vote_average > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <Star className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
                            <span>{item.vote_average.toFixed(1)}</span>
                          </>
                        )}
                      </span>
                    </span>
                    {idx === heroIndex && (
                      <span className="mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-200" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
