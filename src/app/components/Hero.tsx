'use client';

import { Check, Play, Plus, Sparkles, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb-images';
import type { TMDBMediaType } from '@/lib/tmdb-types';

interface HeroProps {
  content: {
    id: string;
    media_type?: TMDBMediaType;
    title: string;
    overview: string;
    backdrop: string | null;
    poster?: string | null;
    rating?: number;
    year?: string;
  };
  primaryCta?: string;
  onWhatToWatch?: () => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
};

export const Hero = ({ content, primaryCta, onWhatToWatch, isInWatchlist, onToggleWatchlist }: HeroProps) => {
  const shouldReduceMotion = useReducedMotion();

  const backdropUrl = getBackdropUrl(content.backdrop ?? content.poster, 'original');
  const posterUrl = getPosterUrl(content.poster, 'w500');

  return (
    <div className="relative min-h-[76svh] md:min-h-[min(820px,88svh)] w-full overflow-hidden mx-auto shadow-2xl shadow-black/50 group/hero">
      {/* Keep the featured artwork visible; video embeds can load without ever starting playback. */}
      <div className="absolute inset-0 bg-slate-950">
        {backdropUrl && (
          <div className="absolute inset-0 opacity-80">
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/35 to-background/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_35%,transparent_5%,rgba(9,9,11,0.2)_72%)]" />
      </div>

      {/* Content */}
      <div className="relative min-h-[76svh] md:min-h-[min(820px,88svh)] w-full max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.62fr)] items-center gap-10 pt-28 pb-32 md:pb-36">
        <motion.div 
          key={content.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
            <span>Now in the spotlight</span>
            <span className="h-1 w-1 rounded-full bg-accent-500" aria-hidden="true" />
            <span className="text-white/55">{content.media_type === 'tv' ? 'Series' : 'Movie'}</span>
          </div>

          {(content.rating || content.year) && (
            <div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-white/85">
              {content.rating !== undefined && content.rating > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span>{content.rating.toFixed(1)}</span>
                  <span className="sr-only">out of 10</span>
                </span>
              )}
              {content.year && <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">{content.year}</span>}
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white mb-5 leading-[0.98] tracking-tight drop-shadow-2xl line-clamp-2">
            {content.title}
          </h1>
          
          <p className="max-w-xl text-white/75 text-base md:text-lg font-light mb-8 leading-relaxed line-clamp-3 drop-shadow-md">
            {content.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {primaryCta && (
              <Link
                href={primaryCta}
                className="px-7 py-3.5 bg-white text-background rounded-full font-semibold tracking-wide hover:bg-brand-50 hover:scale-[1.02] transition-all shadow-[0_12px_40px_-12px_rgba(255,255,255,0.45)] flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                Explore {content.media_type === 'tv' ? 'series' : 'movie'}
              </Link>
            )}

            {onWhatToWatch && (
              <button
                type="button"
                onClick={onWhatToWatch}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-6 py-3.5 font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                <Sparkles className="h-4 w-4 text-brand-200" aria-hidden="true" />
                Match my mood
              </button>
            )}

            {onToggleWatchlist && (
                <button 
                    type="button"
                    onClick={onToggleWatchlist}
                    aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    aria-pressed={Boolean(isInWatchlist)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 ${
                        isInWatchlist 
                        ? 'bg-brand-500/25 border-brand-300/50 text-brand-200'
                        : 'bg-black/30 border-white/20 text-white/80 hover:bg-white/15 hover:text-white'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                    {isInWatchlist ? <Check className="w-5 h-5" aria-hidden="true" /> : <Plus className="w-5 h-5" aria-hidden="true" />}
                </button>
            )}
          </div>
        </motion.div>

        {posterUrl && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 28, rotate: 4 }}
            animate={{ opacity: 1, x: 0, rotate: 2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.15 }}
            className="relative hidden lg:block justify-self-end w-full max-w-[310px]"
            aria-hidden="true"
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-brand-500/20 blur-3xl" />
            <div className="relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border border-white/20 bg-slate-900 shadow-[0_32px_100px_-24px_rgba(0,0,0,0.9)]">
              <Image
                src={posterUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 310px, 0px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-200">
                  Featured pick
                </div>
                <div className="font-display text-2xl leading-tight text-white">
                  {content.title}
                </div>
              </div>
            </div>
            <div className="absolute -right-5 top-8 rounded-full border border-white/15 bg-slate-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 shadow-xl backdrop-blur-xl">
              Featured title
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
};
