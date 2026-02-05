
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/app/components/Navbar';
import { useWatchlistStore } from '@/features/watchlist/store';
import { TMDBMedia } from '@/lib/tmdb';
import { Play, Plus, Check, Star, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActorCard } from '@/app/components/ActorCard';
import { MediaGrid } from '@/app/components/MediaGrid';
import { Section } from '@/app/components/Section';
import Link from 'next/link';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { ReviewForm } from '@/app/components/ReviewForm';

interface MovieDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  reviews?: any[];
  userReview?: any;
}

export function MovieDetails({ data, reviews, userReview }: MovieDetailsProps) {
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : undefined;

  const trailer = data.videos?.results?.find(
    (v: { type: string }) => v.type === 'Trailer' || v.type === 'Teaser'
  );

  const year = (data.release_date || data.first_air_date)?.slice(0, 4);
  const runtime = data.runtime 
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` 
    : undefined;
  
  const rating = data.vote_average?.toFixed(1);

  const { toggle, isSaved } = useWatchlistStore();
  const router = useRouter();
  const saved = isSaved(data.id, data.media_type || 'movie');

  const handleToggle = () => {
    const item: TMDBMedia = data;
    toggle({
      id: item.id,
      mediaType: item.media_type || 'movie',
      title: item.title ?? item.name ?? '',
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
                alt={data.title || data.name}
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

                <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
                    {data.title || data.name}
                </h1>

                {data.tagline && (
                    <p className="text-xl md:text-2xl text-brand-200 font-light italic mb-8 tracking-wide opacity-90 max-w-3xl">
                        "{data.tagline}"
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    {trailer && (
                         <button 
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                            className="group px-8 py-4 bg-white text-background rounded-2xl font-bold tracking-wide hover:bg-brand-50 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Play Trailer
                        </button>
                    )}

                    <button 
                        onClick={handleToggle}
                        className={`px-8 py-4 rounded-2xl font-semibold border flex items-center gap-2 transition-all duration-300 ${
                            saved 
                            ? 'bg-brand-500/20 border-brand-500 text-brand-300' 
                            : 'glass-button hover:bg-white/10 border-white/10'
                        }`}
                    >
                        {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {saved ? 'Watchlist' : 'Add to List'}
                    </button>
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
                        {data.credits?.cast?.slice(0, 10).map((actor: any) => (
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
                {(data.credits?.crew?.some((p: any) => ['Director', 'Writer', 'Screenplay'].includes(p.job)) || data.created_by?.length > 0) && (
                    <ScrollReveal delay={0.3} direction="left">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md space-y-6 shadow-xl">
                            <h3 className="text-sm font-bold text-brand-300 uppercase tracking-widest mb-4">Creatives</h3>
                            
                            {data.credits?.crew?.filter((p: any) => p.job === 'Director').slice(0, 1).map((d: any) => (
                                <div key={d.id}>
                                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Director</div>
                                    <Link href={`/person/${d.id}`} className="font-semibold text-white text-lg hover:text-brand-300 transition-colors">
                                        {d.name}
                                    </Link>
                                </div>
                            ))}
                            
                            {data.credits?.crew?.filter((p: any) => p.job === 'Writer' || p.job === 'Screenplay').slice(0, 2).map((d: any) => (
                                <div key={d.id}>
                                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Writer</div>
                                    <div className="font-medium text-white">{d.name}</div>
                                </div>
                            ))}
                            
                            {data.created_by?.map((d: any) => (
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
                                <div className="font-medium text-white text-brand-100">${data.budget.toLocaleString()}</div>
                            </div>
                        )}
                        
                        {data.revenue > 0 && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Revenue</div>
                                <div className="font-medium text-white text-green-300">${data.revenue.toLocaleString()}</div>
                            </div>
                        )}

                        {data.production_companies?.length > 0 && (
                            <div>
                                <div className="text-white/50 text-xs uppercase tracking-wide mb-2">Production</div>
                                <div className="flex flex-wrap gap-2">
                                    {data.production_companies.slice(0, 3).map((c: any) => (
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
                        mediaType={data.media_type || 'movie'}
                        existingReview={userReview}
                        onReviewAdded={() => router.refresh()}
                    />

                    {/* Reviews List */}
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review: any) => (
                                <div key={review.id} className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
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
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-white font-medium">{review.user.name || 'Anonymous'}</h4>
                                                <div className="flex items-center gap-1">
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
                                                <span className="text-white/50 text-sm">
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
    </div>
  );
}

