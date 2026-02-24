'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { Users, Share2, Play, Pause, Film } from 'lucide-react'
import { SwipeCard } from '@/app/components/SwipeCard'
import type { TMDBMediaType } from '@/lib/tmdb-types'
import { MatchCelebration } from '@/app/components/MatchCelebration'
import { toast } from 'sonner'

interface SwipeMovie {
  id: string
  title: string
  poster: string | null
  mediaType: TMDBMediaType
}

interface SwipeMember {
  userId: string
  user: {
    name: string | null
    imageUrl: string | null
  }
}

interface SwipeSessionClientProps {
  code: string
  members: SwipeMember[]
  initialMovies: SwipeMovie[]
}

export function SwipeSessionClient({ code, members, initialMovies }: SwipeSessionClientProps) {
  const [isActive, setIsActive] = useState(false)
  const [queue, setQueue] = useState<SwipeMovie[]>(initialMovies)
  const [liked, setLiked] = useState<SwipeMovie[]>([])
  const [match, setMatch] = useState<SwipeMovie | null>(null)

  const topIndex = queue.length - 1
  const remaining = queue.length

  const handleInvite = useCallback(async () => {
    const url = `${window.location.origin}/swipe/${code}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Invite link copied to clipboard')
    } catch (error) {
      console.error('Invite copy failed', error)
      toast.error('Could not copy invite link')
    }
  }, [code])

  const handleSwipe = useCallback((direction: 'left' | 'right', movie: SwipeMovie) => {
    setQueue((prev) => prev.slice(0, -1))

    if (direction === 'right') {
      setLiked((prev) => {
        const next = [...prev, movie]
        if (next.length >= 2) {
          setMatch(movie)
        }
        return next
      })
    }
  }, [])

  const isEmpty = remaining === 0

  const statsText = useMemo(() => {
    if (isEmpty) return 'No more titles in this round.'
    if (!isActive) return 'Hit start when your squad is ready.'
    return `${remaining} titles left · ${liked.length} likes`
  }, [isActive, isEmpty, remaining, liked.length])

  return (
    <>
      <main className="max-w-xl mx-auto px-6 pt-32">
        {/* Lobby State */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-400 text-xs font-bold tracking-widest uppercase">
              Session Code: {code}
            </div>
            <h1 className="text-4xl font-display font-bold">Squad Lobby</h1>
            <p className="text-white/40">{statsText}</p>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-center -space-x-4">
            {members.map((member) => (
              <div key={member.userId} className="relative w-16 h-16 rounded-full border-4 border-background overflow-hidden bg-surface">
                {member.user.imageUrl ? (
                  <Image
                    src={member.user.imageUrl}
                    alt={member.user.name || 'Member'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-bold">
                    {(member.user.name || 'U')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-background bg-white/5 flex items-center justify-center">
              <Users className="w-6 h-6 text-white/20" />
            </div>
          </div>

          {/* Card Stack Area */}
          <div className="relative aspect-[3/4] max-w-[350px] mx-auto mt-12">
            {queue.map((movie, i) => (
              <SwipeCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
                mediaType={movie.mediaType}
                isFront={isActive && i === topIndex}
                onSwipe={(dir) => handleSwipe(dir, movie)}
              />
            ))}

            {isEmpty && (
              <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center p-6">
                <Film className="w-10 h-10 text-white/30 mb-3" />
                <h3 className="text-white font-medium text-lg">No more titles</h3>
                <p className="text-white/40 text-sm mt-2">
                  Start a new round or invite more friends to keep swiping.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => setIsActive((prev) => !prev)}
              className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isActive ? 'Pause Swiping' : 'Start Swiping'}
            </button>
            <button
              onClick={handleInvite}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Invite Friends
            </button>
          </div>
        </div>
      </main>

      <MatchCelebration
        isOpen={Boolean(match)}
        movieTitle={match?.title ?? ''}
        poster={match?.poster ?? null}
        onClose={() => setMatch(null)}
      />
    </>
  )
}
