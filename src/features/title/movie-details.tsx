'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import { useWatchlistStore } from '@/features/watchlist/store';
import type { TMDBMediaDetails } from '@/lib/tmdb-types';
import { Play, Plus, Check, Star, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActorCard } from '@/app/components/ActorCard';
import { MediaGrid } from '@/app/components/MediaGrid';
import { Section } from '@/app/components/Section';
import Link from 'next/link';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { ReviewForm } from '@/app/components/ReviewForm';

interface MovieDetailsProps {
  data: TMDBMediaDetails;
  reviews?: MovieReview[];
  userReview?: Pick<MovieReview, 'id' | 'rating' | 'reviewText'> | null;
  isSignedIn: boolean;
}

interface MovieReview {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
}

export function MovieDetails({ data, reviews, userReview, isSignedIn }: MovieDetailsProps) {
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : undefined;

  const trailer = data.videos?.results?.find(
    (video) => video.type === 'Trailer' || video.type === 'Teaser'
  );
  const similarItems = data.similar?.results ?? [];

  const year = (data.release_date || data.first_air_date)?.slice(0, 4);
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : undefined;

  const rating = data.vote_average?.toFixed(1);

  const { toggle, isSaved } = useWatchlistStore();
  const router = useRouter();
  const saved = isSaved(data.id, data.media_type || 'movie');

  const handleToggle = () => {
    toggle({
      id: data.id,
      mediaType: data.media_type || 'movie',
      title: data.title ?? data.name ?? '',
      posterPath: data.poster_path,
      year
    });
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
      
      {/* Cinematic Hero - Cleaned Up */}
      <div className="relative min-h-[82svh] w-full flex items-end pb-20 md:pb-24 [@media(max-height:600px)]:pb-6 group/hero">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {backdropUrl && (
             <Image
                src={backdropUrl}
                alt={data.title ?? data.name ?? 'Movie backdrop'}
                fill
                priority
                className="object-cover"
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Hero Content - Minimalist */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 [@media(max-height:600px)]:pt-24">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-4xl"
            >
                {/* Metadata Badge */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/70 mb-6 [@media(max-height:600px)]:mb-3">
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-500 text-white rounded-md font-bold text-xs shadow-lg shadow-brand-500/20">
                        {data.media_type === 'tv' ? 'SERIES' : 'MOVIE'}
                    </span>
                    {rating && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-white border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            {rating}
                        </span>
                    )}
                    {year && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {year}
                        </span>
                    )}
                    {runtime && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {runtime}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl [@media(max-height:600px)]:text-3xl font-display font-bold text-white mb-4 [@media(max-height:600px)]:mb-2 leading-tight tracking-tight drop-shadow-2xl break-words">
                    {data.title || data.name}
                </h1>

                {data.tagline && (
                    <p className="text-xl md:text-2xl text-brand-200 font-light italic mb-8 [@media(max-height:600px)]:mb-3 tracking-wide opacity-90 max-w-3xl">
                        &ldquo;{data.tagline}&rdquo;
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-8 [@media(max-height:600px)]:mb-0">
                    {trailer && (
                         <button
                            type="button"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                            className="group px-8 py-4 [@media(max-height:600px)]:px-6 [@media(max-height:600px)]:py-3 bg-white text-background rounded-2xl font-bold tracking-wide hover:bg-brand-50 transition-colors shadow-lg shadow-white/5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                            Play Trailer
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-pressed={saved}
                        aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
                        className={`px-8 py-4 [@media(max-height:600px)]:px-6 [@media(max-height:600px)]:py-3 rounded-2xl font-semibold border flex items-center gap-2 transition-all duration-300 ${
                            saved
                            ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                            : 'glass-button hover:bg-white/10 border-white/10'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                    >
                        {saved ? <Check className="w-5 h-5" aria-hidden="true" /> : <Plus className="w-5 h-5" aria-hidden="true" />}
                        <span>{saved ? 'Watchlist' : 'Add to List'}</span>
                    </button>
                </div>
            </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-0 space-y-16 pb-20">
        
        {data.overview && (
            <ScrollReveal delay={0.1}>
                <section>
                    <h2 className="text-2xl text-white font-medium mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-brand-500 rounded-full" />
                        Storyline
                    </h2>
                    <p className="max-w-5xl text-xl text-white/90 leading-relaxed font-light">
                        {data.overview}
                    </p>
                </section>
            </ScrollReveal>
        )}

        {data.credits?.cast && data.credits.cast.length > 0 && (
            <ScrollReveal delay={0.2}>
                <Section title="Top Cast" compact>
                    {data.credits.cast.slice(0, 10).map((actor) => (
                        <div key={actor.id} className="min-w-[120px]">
                            <ActorCard
                                person={{
                                    id: actor.id,
                                    name: actor.name,
                                    profile_path: actor.profile_path,
                                    known_for_department: 'Acting'
                                }}
                            />
                        </div>
                    ))}
                </Section>
            </ScrollReveal>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {(data.credits?.crew?.some((person) =>
                ['Director', 'Writer', 'Screenplay'].includes(person.job ?? '')
              ) || (data.created_by?.length ?? 0) > 0) && (
                <ScrollReveal delay={0.3}>
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-xl backdrop-blur-md">
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-brand-300">Creatives</h3>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {data.credits?.crew?.filter((person) => person.job === 'Director').slice(0, 1).map((director) => (
                                <div key={director.id}>
                                    <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Director</div>
                                    <Link href={`/person/${director.id}`} className="text-lg font-semibold text-white transition-colors hover:text-brand-300">
                                        {director.name}
                                    </Link>
                                </div>
                            ))}
                            {data.credits?.crew?.filter((person) => person.job === 'Writer' || person.job === 'Screenplay').slice(0, 2).map((writer) => (
                                <div key={writer.id}>
                                    <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Writer</div>
                                    <div className="font-medium text-white">{writer.name}</div>
                                </div>
                            ))}
                            {data.created_by?.map((creator) => (
                                <div key={creator.id}>
                                    <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Creator</div>
                                    <div className="font-medium text-white">{creator.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            )}

            <ScrollReveal delay={0.4}>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-xl backdrop-blur-md">
                    <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-brand-300">Info</h3>
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div>
                            <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Status</div>
                            <div className="font-medium text-white">{data.status || 'Unknown'}</div>
                        </div>
                        {data.original_language && (
                            <div>
                                <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Original Language</div>
                                <div className="font-medium uppercase text-white">{data.original_language}</div>
                            </div>
                        )}
                        {typeof data.budget === 'number' && data.budget > 0 && (
                            <div>
                                <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Budget</div>
                                <div className="font-medium text-brand-100">${data.budget.toLocaleString()}</div>
                            </div>
                        )}
                        {typeof data.revenue === 'number' && data.revenue > 0 && (
                            <div>
                                <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Revenue</div>
                                <div className="font-medium text-green-300">${data.revenue.toLocaleString()}</div>
                            </div>
                        )}
                        {data.production_companies && data.production_companies.length > 0 && (
                            <div className="sm:col-span-2">
                                <div className="mb-2 text-xs uppercase tracking-wide text-white/50">Production</div>
                                <div className="flex flex-wrap gap-2">
                                    {data.production_companies.slice(0, 3).map((company) => (
                                        <span key={company.id} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/90">
                                            {company.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollReveal>
        </div>

        {/* More Like This - Full Width */}
        {similarItems.length > 0 && (
            <ScrollReveal delay={0.2}>
                <section className="pt-10 border-t border-white/5">
                    <h2 className="text-2xl font-light text-white mb-8 tracking-wide">You Might Also Like</h2>
                    <MediaGrid items={similarItems.slice(0, 10)} />
                </section>
            </ScrollReveal>
        )}

        {/* Reviews Section */}
        <ScrollReveal delay={0.3}>
            <section className="pt-10 border-t border-white/5">
                <h2 className="text-2xl font-light text-white mb-8 tracking-wide">Reviews</h2>
                <div className="space-y-8">
                    {/* Review Form */}
                    <ReviewForm
                        tmdbId={data.id}
                        mediaType={data.media_type || 'movie'}
                        existingReview={userReview}
                        isSignedIn={isSignedIn}
                        onReviewAdded={() => router.refresh()}
                    />

                    {/* Reviews List */}
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
                                            {review.user.imageUrl ? (
                                                <Image
                                                    src={review.user.imageUrl}
                                                    alt={review.user.name || 'User'}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                                                    {(review.user.name || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                                                <h4 className="min-w-0 text-white font-medium">{review.user.name || 'Anonymous'}</h4>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${
                                                                star <= review.rating
                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                    : 'text-white/20'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="shrink-0 text-white/50 text-sm">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.reviewText && (
                                                <p className="text-white/80 leading-relaxed">{review.reviewText}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-white/50 text-lg">No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </section>
        </ScrollReveal>

      </div>
      </main>
    </div>
  );
}
