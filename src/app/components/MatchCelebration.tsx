'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Film, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { getPosterUrl } from '@/lib/tmdb-images'

interface MatchCelebrationProps {
  isOpen: boolean
  movieTitle: string
  poster: string | null
  onClose: () => void
}

export function MatchCelebration({ isOpen, movieTitle, poster, onClose }: MatchCelebrationProps) {
  const posterUrl = getPosterUrl(poster, 'w500');
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      })
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
          />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-lg glass-panel p-8 rounded-[40px] border border-white/10 text-center space-y-8"
          >
            <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-4xl font-display font-bold">It&apos;s a Match!</h2>
                <p className="text-white/50">Everyone in your squad wants to watch this.</p>
            </div>

            <div className="relative aspect-[2/3] w-48 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/20">
                {posterUrl ? (
                    <Image 
                        src={posterUrl} 
                        alt={movieTitle} 
                        fill 
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-surface flex items-center justify-center text-white/20">No Image</div>
                )}
            </div>

            <h3 className="text-2xl font-display font-bold">{movieTitle}</h3>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Film className="w-5 h-5" />
                    Start Movie
                </button>
                <button 
                   onClick={onClose}
                   className="text-white/30 hover:text-white transition-colors text-sm font-medium"
                >
                    Dismiss
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
