import { Suspense } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { HeroSection } from '@/features/home/sections/hero-section';
import { TrendingSection } from '@/features/home/sections/trending-section';
import { NowPlayingSection } from '@/features/home/sections/now-playing-section';
import { UpcomingSection } from '@/features/home/sections/upcoming-section';
import { TopRatedSection } from '@/features/home/sections/top-rated-section';
import { BingeWorthySection } from '@/features/home/sections/binge-worthy-section';
import { ExploreMoreSection } from '@/features/home/sections/explore-more-section';
import { PopularPeopleSection } from '@/features/home/sections/popular-people-section';
import { SectionSkeleton } from '@/features/home/components/section-skeleton';
import { WhatToWatchEntry } from '@/features/recommend/what-to-watch-entry';
import { WatchlistShelf } from '@/features/watchlist/watchlist-shelf';

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<div className="h-[70vh] md:h-screen bg-slate-900 animate-pulse" />}>
          <HeroSection />
        </Suspense>

        <div className="relative z-10 bg-background">
          <div className="border-y border-white/5 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_70%)]">
            <WhatToWatchEntry />
          </div>

          <WatchlistShelf />

          <Suspense fallback={<SectionSkeleton title="Trending Now" />}>
            <TrendingSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="In Theaters" />}>
            <NowPlayingSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Coming Soon" />}>
            <UpcomingSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Top Rated Classics" />}>
            <TopRatedSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Your next series" />}>
            <BingeWorthySection />
          </Suspense>

          <ExploreMoreSection />

          <Suspense fallback={<div className="py-12 max-w-7xl mx-auto px-6 h-40 bg-white/5 animate-pulse rounded-3xl" />}>
            <PopularPeopleSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
