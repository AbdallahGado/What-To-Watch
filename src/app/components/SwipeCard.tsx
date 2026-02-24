'use client'

import { memo, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import { getPosterUrl } from '@/lib/tmdb-images'
import type { TMDBMediaType } from '@/lib/tmdb-types'

interface SwipeCardProps {
  id: string
  title: string
  poster: string | null
  mediaType: TMDBMediaType
  onSwipe: (direction: 'left' | 'right') => void
  isFront: boolean
}

const SwipeCardComponent = ({ title, poster, mediaType, onSwipe, isFront }: SwipeCardProps) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const heartOpacity = useTransform(x, [50, 150], [0, 1])
  const xOpacity = useTransform(x, [-50, -150], [0, 1])

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right')
    } else if (info.offset.x < -100) {
      onSwipe('left')
    }
  }, [onSwipe])

  const imageUrl = useMemo(
    () => getPosterUrl(poster, 'w500') ?? null,
    [poster]
  )

  const fallbackContent = useMemo(
    () => (
      <div className="w-full h-full bg-surface flex items-center justify-center text-white/20 text-center p-4">
        <p>No Image Available</p>
      </div>
    ),
    []
  )

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isFront ? 10 : 0 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      role="button"
      tabIndex={isFront ? 0 : -1}
      aria-label={`Swipe card for ${title}. Press right arrow to like, left arrow to pass`}
      onKeyDown={(e) => {
        if (!isFront) return
        if (e.key === 'ArrowRight') {
          onSwipe('right')
        } else if (e.key === 'ArrowLeft') {
          onSwipe('left')
        }
      }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl">
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={title}
            fill 
            className="object-cover pointer-events-none"
            priority={isFront}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          fallbackContent
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
        
        {/* Like Indicator */}
        <motion.div 
          style={{ opacity: heartOpacity }} 
          className="absolute top-8 right-8 p-4 rounded-full bg-green-500/20 border-2 border-green-500"
          aria-hidden="true"
        >
          <Heart className="w-8 h-8 text-green-500 fill-green-500" />
        </motion.div>

        {/* Pass Indicator */}
        <motion.div 
          style={{ opacity: xOpacity }} 
          className="absolute top-8 left-8 p-4 rounded-full bg-red-500/20 border-2 border-red-500"
          aria-hidden="true"
        >
          <X className="w-8 h-8 text-red-500" />
        </motion.div>

        {/* Title Section */}
        <div className="absolute bottom-10 left-8 right-8 space-y-2">
          <span className="inline-block px-3 py-1 rounded bg-brand-500 text-[10px] font-bold uppercase tracking-widest text-white">
            {mediaType}
          </span>
          <h2 className="text-3xl font-display font-bold leading-tight line-clamp-2">{title}</h2>
        </div>
      </div>
    </motion.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const SwipeCard = memo(SwipeCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.isFront === nextProps.isFront &&
    prevProps.poster === nextProps.poster &&
    prevProps.title === nextProps.title &&
    prevProps.mediaType === nextProps.mediaType
  )
})
