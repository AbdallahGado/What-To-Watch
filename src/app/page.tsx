import { Suspense } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { HeroSection } from '@/features/home/sections/hero-section';
import { TrendingSection } from '@/features/home/sections/trending-section';
import { NowPlayingSection } from '@/features/home/sections/now-playing-section';
import { UpcomingSection } from '@/features/home/sections/upcoming-section';
import { TopRatedSection } from '@/features/home/sections/top-rated-section';
import { PopularPeopleSection } from '@/features/home/sections/popular-people-section';
import { SectionSkeleton } from '@/features/home/components/section-skeleton';
import { WhatToWatchEntry } from '@/features/recommend/what-to-watch-entry';
import { ScrollReveal } from '@/app/components/ScrollReveal';

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      <main>
        <Suspense fallback={<div className="h-[70vh] md:h-screen bg-slate-900 animate-pulse" />}>
          <HeroSection />
        </Suspense>

        <div className="relative z-10 -mt-20 bg-gradient-to-t from-background via-background to-transparent pt-20 space-y-4">
          <Suspense fallback={<SectionSkeleton title="Trending Now" />}>
            <TrendingSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="In Theaters" />}>
            <NowPlayingSection />
          </Suspense>

          <ScrollReveal delay={0.15}>
            <WhatToWatchEntry />
          </ScrollReveal>

          <Suspense fallback={<SectionSkeleton title="Coming Soon" />}>
            <UpcomingSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Top Rated Classics" />}>
            <TopRatedSection />
          </Suspense>

          <Suspense fallback={<div className="py-12 max-w-7xl mx-auto px-6 h-40 bg-white/5 animate-pulse rounded-3xl" />}>
            <PopularPeopleSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
