'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Check, Clapperboard, Clock3, Play, Plus, Star, Tv } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';
import { ActorCard } from '@/app/components/ActorCard';
import { MediaGrid } from '@/app/components/MediaGrid';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { Section } from '@/app/components/Section';
import { SignedIn, SignedOut, SignInButton, clerkEnabled } from '@/lib/auth-client';
import { useWatchlistStore } from '@/features/watchlist/store';
import type { TMDBMediaDetails, TMDBVideo } from '@/lib/tmdb-types';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb-images';
import { getMediaTitle, getMediaYear } from '@/lib/media';

interface TvDetailsProps {
  data: TMDBMediaDetails;
}

function formatDate(date?: string) {
  if
   (!date) return undefined;
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return undefined;
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(parsedDate);
}

export function TvDetails({ data }: TvDetailsProps) {
  const posterUrl = getPosterUrl(data.poster_path, 'w500');
  const backdropUrl = getBackdropUrl(data.backdrop_path, 'original');
  const title = getMediaTitle(data);
  const year = getMediaYear(data);
  const rating = data.vote_average > 0 ? data.vote_average.toFixed(1) : undefined;
  const mediaType = data.media_type ?? 'tv';
  const overview = data.overview?.trim();
  const cast = data.credits?.cast ?? [];
  const similarItems = data.similar?.results ?? [];
  const episodeRuntime = data.episode_run_time?.find((duration) => duration > 0);
  const trailer = data.videos?.results?.find(
    (video: TMDBVideo) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  ) ?? data.videos?.results?.find(
    (video: TMDBVideo) => video.type === 'Trailer' || video.type === 'Teaser'
  );
  const trailerUrl = trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;
  const airDates = [year, data.last_air_date?.slice(0, 4)].filter(
    (date, index, dates): date is string => Boolean(date) && dates.indexOf(date) === index
  );
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

  const watchlistButton = (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        saved
          ? 'border-brand-400/40 bg-brand-500/20 text-brand-100 hover:bg-brand-500/30'
          : 'border-white/15 bg-white/[0.06] text-white hover:bg-white/10'
      }`}
    >
      {saved ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
      {saved ? 'In your watchlist' : 'Add to watchlist'}
    </button>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-20 text-white">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden pb-12 pt-36 md:min-h-[78svh] md:pb-16">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-background to-background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 px-6 md:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-2.5 text-sm text-white/75">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300/30 bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-100">
                  <Tv className="h-3.5 w-3.5" aria-hidden="true" />
                  Series
                </span>
                {rating && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 backdrop-blur">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    {rating}
                    {data.vote_count ? <span className="text-white/45">({data.vote_count.toLocaleString()})</span> : null}
                  </span>
                )}
                {airDates.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    {airDates.join(' – ')}
                  </span>
                )}
                {episodeRuntime && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    {episodeRuntime} min / episode
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl break-words font-display text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-7xl">
                {title}
              </h1>
              {data.tagline && (
                <p className="mt-4 text-lg italic text-brand-100/90 md:text-xl">
                  &ldquo;{data.tagline}&rdquo;
                </p>
              )}
              {overview && (
                <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                  {overview}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Play ${title} trailer on YouTube`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-background transition-colors hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    Watch trailer
                  </a>
                )}
                {clerkEnabled ? (
                  <>
                    <SignedIn>{watchlistButton}</SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal" forceRedirectUrl="/profile">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                          Sign in to save
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </>
                ) : watchlistButton}
              </div>
            </div>

            {posterUrl && (
              <div className="relative hidden aspect-[2/3] w-full max-w-[220px] justify-self-end overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/50 md:block">
                <Image src={posterUrl} alt={`${title} poster`} fill sizes="220px" className="object-cover" />
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-14 px-6 pt-10 md:space-y-16 md:pt-14">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:gap-12">
            {overview && (
              <ScrollReveal>
                <section aria-labelledby="series-storyline">
                  <h2 id="series-storyline" className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                    <span className="h-7 w-1 rounded-full bg-brand-400" aria-hidden="true" />
                    Storyline
                  </h2>
                  <p className="max-w-3xl text-base leading-8 text-white/75 md:text-lg">{overview}</p>
                  {data.genres && data.genres.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Genres">
                      {data.genres.map((genre) => (
                        <li key={genre.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65">
                          {genre.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </ScrollReveal>
            )}

            <ScrollReveal direction="left">
              <aside aria-labelledby="series-details" className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-xl shadow-black/10 md:p-7">
                <h2 id="series-details" className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-200">
                  Series details
                </h2>
                <dl className="grid grid-cols-2 gap-x-5 gap-y-6">
                  {data.status && (
                    <div>
                      <dt className="text-xs text-white/45">Status</dt>
                      <dd className="mt-1 font-medium text-white">{data.status}</dd>
                    </div>
                  )}
                  {typeof data.number_of_seasons === 'number' && (
                    <div>
                      <dt className="text-xs text-white/45">Seasons</dt>
                      <dd className="mt-1 font-medium text-white">{data.number_of_seasons}</dd>
                    </div>
                  )}
                  {typeof data.number_of_episodes === 'number' && (
                    <div>
                      <dt className="text-xs text-white/45">Episodes</dt>
                      <dd className="mt-1 font-medium text-white">{data.number_of_episodes}</dd>
                    </div>
                  )}
                  {data.original_language && (
                    <div>
                      <dt className="text-xs text-white/45">Original language</dt>
                      <dd className="mt-1 font-medium uppercase text-white">{data.original_language}</dd>
                    </div>
                  )}
                  {data.networks && data.networks.length > 0 && (
                    <div className="col-span-2">
                      <dt className="text-xs text-white/45">Network</dt>
                      <dd className="mt-1 flex flex-wrap gap-2">
                        {data.networks.slice(0, 3).map((network) => (
                          <span key={network.id} className="rounded-full bg-white/[0.07] px-3 py-1 text-sm text-white/80">
                            {network.name}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {data.last_episode_to_air?.name && (
                    <div className="col-span-2 border-t border-white/10 pt-4">
                      <dt className="text-xs text-white/45">Latest episode</dt>
                      <dd className="mt-1 font-medium text-white">{data.last_episode_to_air.name}</dd>
                      <dd className="mt-1 text-xs text-white/50">
                        {[
                          data.last_episode_to_air.season_number != null && `Season ${data.last_episode_to_air.season_number}`,
                          data.last_episode_to_air.episode_number != null && `Episode ${data.last_episode_to_air.episode_number}`,
                          formatDate(data.last_episode_to_air.air_date)
                        ].filter(Boolean).join(' · ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </aside>
            </ScrollReveal>
          </div>

          {cast.length > 0 && (
            <ScrollReveal>
              <Section title="Cast" compact>
                {cast.slice(0, 12).map((actor) => (
                  <div key={actor.id} className="w-[120px] shrink-0">
                    <Link href={`/person/${actor.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300">
                      <ActorCard
                        person={{
                          id: actor.id,
                          name: actor.name,
                          profile_path: actor.profile_path,
                          known_for_department: 'Acting'
                        }}
                      />
                      {actor.character && (
                        <span className="mt-1 block truncate px-1 text-center text-xs text-white/45">
                          {actor.character}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </Section>
            </ScrollReveal>
          )}

          {similarItems.length > 0 && (
            <ScrollReveal>
              <section aria-labelledby="similar-series" className="border-t border-white/10 pt-10">
                <div className="mb-7 flex items-end gap-3">
                  <Clapperboard className="mb-1 h-5 w-5 text-brand-300" aria-hidden="true" />
                  <h2 id="similar-series" className="text-2xl font-semibold text-white">More like this</h2>
                </div>
                <MediaGrid items={similarItems.slice(0, 10)} />
              </section>
            </ScrollReveal>
          )}
        </div>
      </main>
    </div>
  );
}
