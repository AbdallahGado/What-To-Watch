'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { Content } from '../data/mockData';
import { MovieCard } from './MovieCard';

interface DetailsModalProps {
  content: Content | null;
  onClose: () => void;
  similarContent: Content[];
  onPlay?: () => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
}

export const DetailsModal = ({ content, onClose, similarContent, onPlay, isInWatchlist, onToggleWatchlist }: DetailsModalProps) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0f1115]/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-[#1e2128] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/5"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button - Floating */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[110] p-3 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/40 transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Section */}
          <div className="relative h-[55vh] w-full">
            <Image 
              src={content.backdrop} 
              alt={content.title}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e2128] via-[#1e2128]/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-10 w-full z-10">
              <h2 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">{content.title}</h2>
              <div className="flex items-center gap-6 text-white/60 font-light mb-8">
                <span className="text-green-400 font-medium">{content.rating * 10}% Match</span>
                <span>{content.year}</span>
                <span className="border border-white/10 px-3 py-0.5 rounded-full text-xs tracking-wider">HD</span>
                <span>{content.duration}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                    onClick={onPlay}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-[#0f1115] rounded-full font-medium hover:bg-brand-50 transition-colors shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" /> Play Feature
                </button>
                {onToggleWatchlist && (
                    <button 
                        onClick={onToggleWatchlist}
                        className={`p-4 border rounded-full transition-all ${
                            isInWatchlist 
                            ? 'bg-brand-500 border-brand-500 text-white' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                    >
                        {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                )}
                <button className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white">
                  <ThumbsUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-10">
            <div className="md:col-span-2 space-y-10">
              <div>
                <h3 className="text-lg font-medium text-white mb-4 tracking-wide opacity-50 uppercase text-xs">Synopsis</h3>
                <p className="text-gray-300 leading-loose text-lg font-light">
                  {content.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-6 tracking-wide opacity-50 uppercase text-xs">Cast & Crew</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                  {content.cast.map(actor => (
                    <div key={actor.id} className="flex flex-col items-center gap-3 min-w-[80px]">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/5">
                        <Image src={actor.image} alt={actor.name} fill className="object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="text-white text-sm font-medium">{actor.name}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Actor</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Director</div>
                <div className="text-white font-medium text-lg">{content.director || 'Unknown'}</div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Genres</div>
                <div className="flex flex-wrap gap-2">
                  {content.genres.map(g => (
                    <span key={g} className="text-sm px-3 py-1 bg-white/5 rounded-full text-gray-300 border border-white/5">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Content */}
          <div className="p-10 border-t border-white/5 bg-black/10">
            <h3 className="text-xl font-light text-white mb-8">You might also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarContent.slice(0, 4).map(item => (
                <MovieCard key={item.id} content={item} onClick={() => {}} variant="portrait" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
