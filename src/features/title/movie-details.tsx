
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import { SignedIn, SignedOut, SignInButton, clerkEnabled } from '@/lib/auth-client';
import { useWatchlistStore } from '@/features/watchlist/store';
import type { TMDBCastMember, TMDBCrewMember, TMDBMedia, TMDBMediaDetails, TMDBVideo } from '@/lib/tmdb-types';
import { getBackdropUrl } from '@/lib/tmdb-images';
import { getMediaTitle, getMediaYear } from '@/lib/media';
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
  reviews?: ReviewWithUser[];
  userReview?: UserReview | null;
  isSignedIn?: boolean;
}

interface ReviewUser {
  name?: string | null;
  imageUrl?: string | null;
}

interface ReviewWithUser {
  id: string;
  rating: number;
  reviewText?: string | null;
  createdAt: string | Date;
  user: ReviewUser;
}

interface UserReview {
  id: string;
  rating: number;
  reviewText?: string | null;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const reviewDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

export function MovieDetails({ data, reviews, userReview, isSignedIn }: MovieDetailsProps) {
  const backdropUrl = getBackdropUrl(data.backdrop_path, 'original');
  const title = getMediaTitle(data);
  const mediaType = data.media_type ?? 'movie';
  const tagline = data.tagline?.trim();

  const trailer = data.videos?.results?.find(
    (v: TMDBVideo) => v.type === 'Trailer' || v.type === 'Teaser'
  );
  const trailerUrl = trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;

  const year = getMediaYear(data);
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : undefined;

  const rating = data.vote_average > 0 ? data.vote_average.toFixed(1) : undefined;
  const cast = data.credits?.cast ?? [];
  const crew = data.credits?.crew ?? [];
  const creators = data.created_by ?? [];
  const directors = crew.filter((person) => person.job === 'Director');
  const writers = crew.filter((person) => person.job === 'Writer' || person.job === 'Screenplay');
  const showCreatives = directors.length > 0 || writers.length > 0 || creators.length > 0;
  const reviewItems = reviews ?? [];
  const hasReviews = reviewItems.length > 0;

  const { toggle, isSaved } = useWatchlistStore();
  const router = useRouter();
  const saved = isSaved(data.id, mediaType);

  const handleToggle = () => {
    const item: TMDBMedia = data;
    toggle({
      id: item.id,
      mediaType,
      title,
      posterPath: item.poster_path,
      year
    });
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Hero - Cleaned Up */}
      <div className="relative min-h-screen w-full flex items-end pb-32 group/hero">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {backdropUrl && (
             <Image
                src={backdropUrl}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Hero Content - Minimalist */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-4xl"
            >
                {/* Metadata Badge */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/70 mb-6">
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-500 text-white rounded-md font-bold text-xs shadow-lg shadow-brand-500/20">
                        {mediaType === 'tv' ? 'SERIES' : 'MOVIE'}
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

                <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
                    {title}
                </h1>

                {tagline && (
                  <p className="text-xl md:text-2xl text-brand-200 font-light italic mb-8 tracking-wide opacity-90 max-w-3xl">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    {trailerUrl && (
                      <a
                        href={trailerUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group px-8 py-4 bg-white text-background rounded-2xl font-bold tracking-wide hover:bg-brand-50 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                        aria-label={`Play ${title} trailer`}
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Play Trailer
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
                                    className={`px-8 py-4 rounded-2xl font-semibold border flex items-center gap-2 transition-all duration-300 ${
                                        saved 
                                        ? 'bg-brand-500/20 border-brand-500 text-brand-300' 
                                        : 'glass-button hover:bg-white/10 border-white/10'
                                    }`}
                                >
                                    {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {saved ? 'Watchlist' : 'Add to List'}
                                </button>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal" forceRedirectUrl="/profile">
                                    <button
                                        type="button"
                                        className="px-8 py-4 rounded-2xl font-semibold border flex items-center gap-2 transition-all duration-300 glass-button hover:bg-white/10 border-white/10 text-white/80"
                                        aria-label="Sign in to add to watchlist"
                                    >
                                        <Plus className="w-5 h-5" />
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
                            className={`px-8 py-4 rounded-2xl font-semibold border flex items-center gap-2 transition-all duration-300 ${
                                saved 
                                ? 'bg-brand-500/20 border-brand-500 text-brand-300' 
                                : 'glass-button hover:bg-white/10 border-white/10'
                            }`}
                        >
                            {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {saved ? 'Watchlist' : 'Add to List'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 space-y-16 pb-20">
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Story & Info */}
            <div className="lg:col-span-2 space-y-12">
                {data.overview && (
                    <ScrollReveal delay={0.1}>
                        <section>
                            <h2 className="text-2xl text-white font-medium mb-6 flex items-center gap-3">
                                <span className="w-1 h-8 bg-brand-500 rounded-full" />
                                Storyline
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed font-light">
                                {data.overview}
                            </p>
                        </section>
                    </ScrollReveal>
                )}

                <ScrollReveal delay={0.2}>
                    <Section title="Top Cast">
                        {cast.slice(0, 10).map((actor: TMDBCastMember) => (
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
            </div>

            {/* Right Column: Key Details */}
            <div className="space-y-8">
                {/* Director & Crew Widget - Only show if we have crew info */}
                {showCreatives && (
                    <ScrollReveal delay={0.3} direction="left">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md space-y-6 shadow-xl">
                            <h3 className="text-sm font-bold text-brand-300 uppercase tracking-widest mb-4">Creatives</h3>
                            
                            {directors.slice(0, 1).map((d: TMDBCrewMember) => (
                                <div key={d.id}>
                                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Director</div>
                                    <Link href={`/person/${d.id}`} className="font-semibold text-white text-lg hover:text-brand-300 transition-colors">
                                        {d.name}
                                    </Link>
                                </div>
                            ))}
                            
                            {writers.slice(0, 2).map((d: TMDBCrewMember) => (
                                <div key={d.id}>
                                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Writer</div>
                                    <div className="font-medium text-white">{d.name}</div>
                                </div>
                            ))}
                            
                            {creators.map((d: TMDBCrewMember) => (
                                <div key={d.id}>
                                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Creator</div>
                                    <div className="font-medium text-white">{d.name}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                )}

                {/* Facts Widget */}
                {/* Always show, but only render available fields */}
                <ScrollReveal delay={0.4} direction="left">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md space-y-6 shadow-xl">
                        <h3 className="text-sm font-bold text-brand-300 uppercase tracking-widest mb-4">Info</h3>
                        
                        <div>
                            <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Status</div>
                            <div className="font-medium text-white">{data.status || 'Unknown'}</div>
                        </div>
                        
                        {data.original_language && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Original Language</div>
                                <div className="font-medium text-white uppercase">{data.original_language}</div>
                            </div>
                        )}

                        {data.budget > 0 && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Budget</div>
                                <div className="font-medium text-white text-brand-100">
                                  {currencyFormatter.format(data.budget)}
                                </div>
                            </div>
                        )}
                        
                        {data.revenue > 0 && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Revenue</div>
                                <div className="font-medium text-white text-green-300">
                                  {currencyFormatter.format(data.revenue)}
                                </div>
                            </div>
                        )}

                        {data.production_companies?.length > 0 && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-2">Production</div>
                                <div className="flex flex-wrap gap-2">
                                    {data.production_companies.slice(0, 3).map((c) => (
                                        <span key={c.id} className="text-xs text-white/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollReveal>
            </div>
        </div>

        {/* More Like This - Full Width */}
        {data.similar?.results?.length > 0 && (
            <ScrollReveal delay={0.2}>
                <section className="pt-10 border-t border-white/5">
                    <h2 className="text-2xl font-light text-white mb-8 tracking-wide">You Might Also Like</h2>
                    <MediaGrid items={data.similar.results.slice(0, 10)} />
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
                        mediaType={mediaType}
                        existingReview={userReview}
                        onReviewAdded={() => router.refresh()}
                        isSignedIn={isSignedIn}
                    />

                    {/* Reviews List */}
                    {hasReviews ? (
                        <div className="space-y-6">
                            {reviewItems.map((review) => (
                                <div key={review.id} className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                            {review.user.imageUrl ? (
                                                <Image
                                                    src={review.user.imageUrl}
                                                    alt={review.user.name || 'User'}
                                                    width={48}
                                                    height={48}
                                                    sizes="48px"
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                                                    {(review.user.name || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-white font-medium">{review.user.name || 'Anonymous'}</h4>
                                                <div className="flex items-center gap-1" role="img" aria-label={`${review.rating} out of 5`}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${
                                                                star <= review.rating
                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                    : 'text-white/20'
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-white/50 text-sm">
                                                    {reviewDateFormatter.format(new Date(review.createdAt))}
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
    </div>
  );
}

