import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Instagram, Twitter, Globe } from 'lucide-react';
import { Actor, CONTENT } from '../data/mockData';
import { MovieCard } from './MovieCard';

interface ActorModalProps {
  actor: Actor | null;
  onClose: () => void;
  movies: typeof CONTENT;
}

export const ActorModal = ({ actor, onClose, movies }: ActorModalProps) => {
  if (!actor) return null;

  // Filter movies where this actor is in the cast
  const actorMovies = movies.filter(m => m.cast.some(c => c.id === actor.id));

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="relative w-full max-w-4xl bg-[#18181b] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3 aspect-[2/3] md:aspect-auto">
              <Image 
                src={actor.image} 
                alt={actor.name} 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 p-8">
              <h2 className="text-4xl font-bold text-white mb-2">{actor.name}</h2>
              <p className="text-gray-400 mb-6">Actor • Producer</p>
              
              <div className="flex gap-4 mb-8">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                  <Globe className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Known For</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {actorMovies.map(movie => (
                      <div key={movie.id} className="group cursor-pointer">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                           <Image src={movie.backdrop} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{movie.title}</div>
                        <div className="text-xs text-gray-500">{movie.year}</div>
                      </div>
                    ))}
                    {actorMovies.length === 0 && <p className="text-gray-500">No movies listed.</p>}
                  </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Biography</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        One of the most talented actors of their generation, with a diverse range of roles spanning independent drama to blockbuster sci-fi.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
