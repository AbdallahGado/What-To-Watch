'use client';

import type { TMDBMedia, TMDBPerson } from '@/lib/tmdb-types';
import { Navbar } from '@/app/components/Navbar';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { ActorCard } from '@/app/components/ActorCard';
import { MovieCard } from '@/app/components/MovieCard';
import { WhatToWatchEntry } from '@/features/recommend/what-to-watch-entry';
import Link from 'next/link';
import { HeroCarousel } from '@/features/home/components/hero-carousel';
import { getMediaHref, toCardData } from '@/lib/media';

interface HomeShellProps {
  trending: TMDBMedia[];
  topRated: TMDBMedia[];
  people: TMDBPerson[];
  upcoming: TMDBMedia[];
  nowPlaying: TMDBMedia[];
}

export function HomeShell({ trending, topRated, people, upcoming, nowPlaying }: HomeShellProps) {
  const heroItems = trending.slice(0, 5);

  const topSections = [
    { title: 'Trending Now', items: trending, delay: 0 },
    { title: 'In Theaters', items: nowPlaying, delay: 0.1 }
  ];

  const bottomSections = [
    { title: 'Coming Soon', items: upcoming, delay: 0.2 },
    { title: 'Top Rated Classics', items: topRated, delay: 0.25 }
  ];

  const renderMediaCard = (item: TMDBMedia) => (
    <Link href={getMediaHref(item)}>
      <MovieCard tmdb={toCardData(item)} variant="portrait" />
    </Link>
  );

  const renderSections = (sections: Array<{ title: string; items: TMDBMedia[]; delay: number }>) =>
    sections.map((section) =>
      section.items.length > 0 ? (
        <ScrollReveal key={section.title} delay={section.delay}>
          <Section title={section.title} items={section.items} renderItem={renderMediaCard} />
        </ScrollReveal>
      ) : null
    );

  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      <main>
        {heroItems.length > 0 && <HeroCarousel items={heroItems} />}

        <div className="relative z-10 -mt-20 bg-gradient-to-t from-background via-background to-transparent pt-20 space-y-4">
          {renderSections(topSections)}

          <ScrollReveal delay={0.15}>
            <WhatToWatchEntry />
          </ScrollReveal>

          {renderSections(bottomSections)}

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

