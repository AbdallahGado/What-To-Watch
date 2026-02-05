'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  content: {
    id: string;
    media_type?: string; 
    title: string;
    overview: string;
    backdrop: string | null;
    poster?: string | null;
  };
  primaryCta?: string;
  onWhatToWatch?: () => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export const Hero = ({ content, primaryCta, onWhatToWatch, isInWatchlist, onToggleWatchlist }: HeroProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  function makeImageUrl(path?: string | null) {
    if (!path) return undefined
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `https://image.tmdb.org/t/p/original${path}`
  }

  const backdropUrl = makeImageUrl(content.backdrop ?? content.poster)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const id = parseInt(content.id);
        if (!id) return;

        const resp = await fetch(`/api/tmdb/videos?id=${id}&type=${content.media_type === 'tv' ? 'tv' : 'movie'}`)
        if (!resp.ok) return
        const videos = await resp.json()
        const trailer = Array.isArray(videos)
          ? videos.find((v: any) => v.type === 'Trailer' || v.type === 'Teaser')
          : null
        if (trailer?.key) {
          setTrailerKey(trailer.key)
        }
      } catch (e) {
        console.error('Failed to load hero video', e)
      }
    }

    fetchVideo()
  }, [content.id, content.media_type]);

  return (
    <div className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden mx-auto shadow-2xl shadow-black/50 group/hero">
      {/* Background Layer: Video or Image */}
      <div className="absolute inset-0 bg-slate-950">
         {/* Background Image (always present behind, or as fallback) */}
        {backdropUrl && (
          <div className={`w-full h-full ${isVideoLoaded ? 'opacity-0' : 'opacity-50'} transition-opacity duration-1000`}>
            <Image
              src={backdropUrl}
              alt={content.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        
        {/* Youtube Video Iframe */}
        {trailerKey && (
            <div className={`absolute inset-0 scale-125 pointer-events-none transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-40' : 'opacity-0'}`}>
                <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&start=10&modestbranding=1&rel=0`}
                    title="Hero Video"
                    allow="autoplay; encrypted-media"
                    onLoad={() => setTimeout(() => setIsVideoLoaded(true), 2000)}
                />
            </div>
        )}
        
        {/* Artistic Gradient Overlays - Simplified for performance */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-32 md:pb-40 pt-32">
        <motion.div 
          key={content.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium tracking-widest uppercase">
                Top Pick
             </span>
             <div className="h-px w-8 bg-white/20" />
             <span className="text-brand-300 text-xs font-medium tracking-wider uppercase">
                {isVideoLoaded ? 'Now Playing Trailer' : 'Trending Now'}
             </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white mb-6 leading-[1] tracking-tight">
            {content.title}
          </h1>
          
          <p className="max-w-xl text-white/70 text-base md:text-lg font-light mb-8 leading-relaxed line-clamp-3">
            {content.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {primaryCta && (
              <a
                href={primaryCta}
                className="px-8 py-4 bg-white text-background rounded-2xl font-semibold tracking-wide hover:bg-brand-50 transition-colors shadow-lg flex items-center gap-2"
              >
                 <Play className="w-5 h-5 fill-current" />
                 Open Details
              </a>
            )}

            {onToggleWatchlist && (
                <button 
                    onClick={onToggleWatchlist}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isInWatchlist 
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating "What To Watch" FAB */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-12 z-20 hidden lg:block"
      >
          <button 
            onClick={onWhatToWatch}
            className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/5 p-2 pr-6 rounded-full shadow-2xl hover:bg-slate-900 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center">
                <span className="text-lg">✨</span>
            </div>
            <div className="text-left">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Mood Matcher</div>
                <div className="text-xs font-medium text-white">Find something new</div>
            </div>
          </button>
      </motion.div>
    </div>
  );
};
