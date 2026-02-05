'use client';

import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import { useWatchlistStore } from '@/features/watchlist/store';

interface TvDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function TvDetails({ data }: TvDetailsProps) {
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : undefined;
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : undefined;

  const trailer = data.videos?.results?.find(
    (v: { type: string }) => v.type === 'Trailer'
  );

  const year = data.first_air_date?.slice(0, 4);

  const { toggle, isSaved } = useWatchlistStore();
  const saved = isSaved(data.id, 'tv');

  const handleToggle = () => {
    toggle({
      id: data.id,
      mediaType: 'tv',
      title: data.name ?? '',
      posterPath: data.poster_path,
      year
    });
  };

  return (
    <div className="min-h-screen bg-background text-white pb-16">
      <Navbar />
      <main className="pt-24">
        <section className="relative w-full max-w-5xl mx-auto px-6">
          <div className="relative h-[260px] w-full rounded-3xl overflow-hidden bg-slate-900">
            {backdropUrl && (
              <Image
                src={backdropUrl}
                alt={data.name}
                fill
                className="object-cover opacity-70"
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 -mt-20 relative">
            <div className="w-40 shrink-0">
              {posterUrl && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl">
                  <Image
                    src={posterUrl}
                    alt={data.name}
                    width={260}
                    height={390}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3 pt-4">
              <h1 className="text-3xl font-light">
                {data.name}{' '}
                {year && (
                  <span className="text-white/60 text-xl font-normal">
                    ({year})
                  </span>
                )}
              </h1>
              <p className="text-sm text-white/70 max-w-2xl">{data.overview}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-medium">
                  Play trailer
                </button>
                <button
                  onClick={handleToggle}
                  className="px-4 py-2 rounded-full border border-white/30 text-xs font-medium hover:bg-white/10"
                >
                  {saved ? 'Remove from watchlist' : 'Add to watchlist'}
                </button>
              </div>
            </div>
          </div>

          {trailer && (
            <section className="mt-10">
              <h2 className="text-sm font-medium mb-3">Trailer</h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={data.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

