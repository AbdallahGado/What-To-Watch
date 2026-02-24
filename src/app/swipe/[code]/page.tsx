import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { Navbar } from '@/app/components/Navbar'
import { SwipeSessionClient } from './SwipeSessionClient'
import type { TMDBMediaType } from '@/lib/tmdb-types'

export default async function SwipePage({ params }: { params: { code: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const session = await db.watchSession.findUnique({
    where: { code: params.code.toUpperCase() },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-white">Session not found.</div>
  }

  const members = session.members
  
  // Mock data for results for now (in Phase 3 we'd fetch actual trending movies)
  const initialMovies: Array<{
    id: string
    title: string
    poster: string | null
    mediaType: TMDBMediaType
  }> = [
    { id: '1', title: 'The Substance', poster: '/lqo0vYpXfcnq46pYg8A9Uq1S3QG.jpg', mediaType: 'movie' },
    { id: '2', title: 'Agatha All Along', poster: '/6axYU0E0i6jCAnD7wclCSTcWzL2.jpg', mediaType: 'tv' },
    { id: '3', title: 'Smile 2', poster: '/6uV9v3sCbe759T25X4W1TzUfR6Y.jpg', mediaType: 'movie' },
  ]

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Navbar />
      <SwipeSessionClient code={params.code.toUpperCase()} members={members} initialMovies={initialMovies} />
    </div>
  )
}
