'use client';

import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import { SignedIn, SignedOut, SignInButton, clerkEnabled } from '@/lib/auth-client';
import { useWatchlistStore } from '@/features/watchlist/store';
import type { TMDBMediaDetails, TMDBVideo } from '@/lib/tmdb-types';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb-images';
import { getMediaTitle, getMediaYear } from '@/lib/media';

interface TvDetailsProps {
  data: TMDBMediaDetails;
}

export function TvDetails({ data }: TvDetailsProps) {
  const posterUrl = getPosterUrl(data.poster_path, 'w500');
  const backdropUrl = getBackdropUrl(data.backdrop_path, 'original');
  const title = getMediaTitle(data);
  const year = getMediaYear(data);
  const mediaType = data.media_type ?? 'tv';
  const overview = data.overview?.trim();

  const trailer = data.videos?.results?.find(
    (v: TMDBVideo) => v.type === 'Trailer' || v.type === 'Teaser'
  );
  const trailerUrl = trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;

  const { toggle, isSaved } = useWatchlistStore();
  const saved = isSaved(data.id, mediaType);

  const handleToggle = () => {
    toggle({
      id: data.id,
      mediaType,
      title,
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
                alt={title}
                fill
                sizes="100vw"
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
                    alt={title}
                    width={260}
                    height={390}
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3 pt-4">
              <h1 className="text-3xl font-light">
                {title}{' '}
                {year && (
                  <span className="text-white/60 text-xl font-normal">
                    ({year})
                  </span>
                )}
              </h1>
              {overview && (
                <p className="text-sm text-white/70 max-w-2xl">{overview}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-medium"
                    aria-label={`Play ${title} trailer`}
                  >
                    Play trailer
                  </a>
                )}
                {clerkEnabled ? (
                  <>
                    <SignedIn>
                      <button
                        type="button"
                        onClick={handleToggle}
                        aria-pressed={saved}
                        aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
                        className="px-4 py-2 rounded-full border border-white/30 text-xs font-medium hover:bg-white/10"
                      >
                        {saved ? 'Remove from watchlist' : 'Add to watchlist'}
                      </button>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal" forceRedirectUrl="/profile">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-full border border-white/30 text-xs font-medium hover:bg-white/10 text-white/70"
                          aria-label="Sign in to add to watchlist"
                        >
                          Sign in to add
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggle}
                    aria-pressed={saved}
                    aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
                    className="px-4 py-2 rounded-full border border-white/30 text-xs font-medium hover:bg-white/10"
                  >
                    {saved ? 'Remove from watchlist' : 'Add to watchlist'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {trailer && (
            <section className="mt-10">
              <h2 className="text-sm font-medium mb-3">Trailer</h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={title}
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

