'use client';

import { Navbar } from '@/app/components/Navbar';
import { useWatchlistStore } from '@/features/watchlist/store';
import { MediaGrid } from '@/app/components/MediaGrid';
import { TMDBMedia } from '@/lib/tmdb';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

export default function CollectionPage() {
  const { items } = useWatchlistStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert map to array and format for grid
  const mediaItems: TMDBMedia[] = Object.values(items).map(item => ({
    id: item.id,
    media_type: item.mediaType,
    title: item.title,
    name: item.title, // Handle both title props
    poster_path: item.posterPath,
    overview: '', // Not needed for grid card
    backdrop_path: null,
    vote_average: 0, // Not stored currently
    release_date: item.year ? `${item.year}-01-01` : undefined,
    first_air_date: item.year ? `${item.year}-01-01` : undefined,
  }));

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar activeView="list" />
      <div className="pt-32 px-6 max-w-7xl mx-auto min-h-[60vh]">
        <h1 className="text-4xl md:text-5xl font-display font-light mb-4">My Collection</h1>
        <p className="text-white/60 text-lg mb-12 font-light max-w-2xl">
          Your personal library of movies and series you want to watch.
        </p>

        {isMounted ? (
            mediaItems.length > 0 ? (
                <MediaGrid items={mediaItems} />
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5"
                >
                    <Film className="w-10 h-10 text-white/40 mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-medium text-white mb-2">Build your library</h3>
                    <p className="text-white/50 mb-8 max-w-sm text-center">
                        Tap the "Add to List" button on any movie or show to save it here.
                    </p>
                </motion.div>
            )
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
                 {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-full aspect-[2/3] bg-white/5 rounded-3xl animate-pulse" />
                 ))}
            </div>
        )}
      </div>
    </div>
  );
}

