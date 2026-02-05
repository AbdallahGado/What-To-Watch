'use client';

import { TMDBMedia, TMDBPerson } from '@/lib/tmdb';
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { ActorCard } from '@/app/components/ActorCard';
import { MovieCard } from '@/app/components/MovieCard';
import { WhatToWatchEntry } from '@/features/recommend/what-to-watch-entry';
import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';

interface HomeShellProps {
  trending: TMDBMedia[];
  topRated: TMDBMedia[];
  people: TMDBPerson[];
  upcoming: TMDBMedia[];
  nowPlaying: TMDBMedia[];
}

export function HomeShell({ trending, topRated, people, upcoming, nowPlaying }: HomeShellProps) {
  const router = useRouter(); // Initialize router
  const [heroIndex, setHeroIndex] = useState(0);
  const heroItems = trending.slice(0, 5); // Rotate top 5
  
  // Auto-rotate hero
  useEffect(() => {
    const interval = setInterval(() => {
        setHeroIndex(prev => (prev + 1) % heroItems.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const hero = heroItems[heroIndex];

  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      <main>
        {hero && (
           <div className="relative group">
                <Hero
                    key={hero.id} // Re-mounts on change for animation
                    content={{
                    id: String(hero.id),
                    media_type: hero.media_type,
                    title: hero.title ?? hero.name ?? 'Untitled',
                    overview: hero.overview,
                    backdrop: hero.backdrop_path,
                    poster: hero.poster_path
                    }}
                    primaryCta={
                    hero.media_type === 'tv'
                        ? `/tv/${hero.id}`
                        : `/movie/${hero.id}`
                    }
                    onWhatToWatch={() => router.push('/what-to-watch')}
                />
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-32 md:bottom-20 right-12 flex gap-2 z-20">
                    {heroItems.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setHeroIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
           </div>
        )}

        <div className="relative z-10 -mt-20 bg-gradient-to-t from-background via-background to-transparent pt-20 space-y-4">
          <ScrollReveal>
             <Section
                title="Trending Now"
                items={trending}
                renderItem={(item: any) => (
                  <Link
                    href={
                      item.media_type === 'tv'
                        ? `/tv/${item.id}`
                        : `/movie/${item.id}`
                    }
                  >
                    <MovieCard
                      tmdb={{
                        id: item.id,
                        title: item.title ?? item.name ?? '',
                        poster_path: item.poster ?? item.poster_path,
                        vote_average: item.vote_average ?? item.rating
                      }}
                      variant="portrait"
                    />
                  </Link>
                )}
              />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
             <Section
                title="In Theaters"
                items={nowPlaying}
                renderItem={(item: any) => (
                  <Link
                    href={`/movie/${item.id}`}
                  >
                    <MovieCard
                      tmdb={{
                        id: item.id,
                        title: item.title ?? item.name ?? '',
                        poster_path: item.poster ?? item.poster_path,
                        vote_average: item.vote_average ?? item.rating
                      }}
                      variant="portrait"
                    />
                  </Link>
                )}
              />
          </ScrollReveal>

          <Suspense>
             <ScrollReveal delay={0.15}>
                <WhatToWatchEntry />
             </ScrollReveal>
          </Suspense>

          <ScrollReveal delay={0.2}>
              <Section
                title="Coming Soon"
                items={upcoming}
                renderItem={(item: any) => (
                  <Link
                    href={`/movie/${item.id}`}
                  >
                    <MovieCard
                      tmdb={{
                        id: item.id,
                        title: item.title ?? item.name ?? '',
                        poster_path: item.poster ?? item.poster_path,
                        vote_average: item.vote_average ?? item.rating
                      }}
                      variant="portrait"
                    />
                  </Link>
                )}
              />
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
              <Section
                title="Top Rated Classics"
                items={topRated}
                renderItem={(item: any) => (
                  <Link href={`/movie/${item.id}`}>
                    <MovieCard
                      tmdb={{
                        id: item.id,
                        title: item.title ?? '',
                        poster_path: item.poster ?? item.poster_path,
                        vote_average: item.vote_average ?? item.rating
                      }}
                      variant="portrait"
                    />
                  </Link>
                )}
              />
          </ScrollReveal>

          <section className="py-8 max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-8 tracking-wide">
              Popular Stars
            </h2>
            <div className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar">
              {people.map((person) => (
                <Link key={person.id} href={`/person/${person.id}`}>
                  <ActorCard person={person} />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

