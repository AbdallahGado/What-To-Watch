'use server'

import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addXp(amount: number, _reason: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await db.user.update({
    where: { id: userId },
    data: {
      xp: { increment: amount }
    }
  })

  // Basic leveling logic: every 1000 XP is a level
  const newLevel = Math.floor(user.xp / 1000) + 1
  if (newLevel > user.level) {
    await db.user.update({
      where: { id: userId },
      data: { level: newLevel }
    })
  }

  revalidatePath('/profile')
  return { xp: user.xp, level: newLevel }
}

export async function addToWatchlist(item: { tmdbId: number, title: string, mediaType: string, poster: string | null }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    await db.watchlistItem.create({
      data: {
        userId,
        ...item
      }
    })

    // Reward XP for adding to watchlist
    await addXp(50, 'Added to watchlist')
  } catch (error) {
    // Item might already exist
    console.error('Watchlist add error', error)
  }

  revalidatePath('/collection')
}

export async function updateCinephileDNA(genres: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Map of genre strings to schema fields
  const genreMap: Record<string, string> = {
    'Action': 'action',
    'Comedy': 'comedy',
    'Drama': 'drama',
    'Horror': 'horror',
    'Science Fiction': 'sciFi',
    'Romance': 'romance',
    'Thriller': 'thriller'
  }

  const updateData: any = {}
  genres.forEach(g => {
    const field = genreMap[g]
    if (field) {
      updateData[field] = { increment: 5 } // Increment DNA score for that genre
    }
  })

  if (Object.keys(updateData).length === 0) {
    return { updated: false }
  }

  await db.cinephileDNA.update({
    where: { userId },
    data: updateData
  })

  // Reward XP for "watching/rating" which triggers DNA updates
  await addXp(100, 'Engagement')

  return { updated: true }
}


