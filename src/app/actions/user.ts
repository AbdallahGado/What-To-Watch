'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ensureDbUser } from '@/lib/ensure-user';

type WatchlistPayload = {
  tmdbId: number;
  title: string;
  mediaType: string;
  poster: string | null;
};

export async function addXp(amount: number, _reason: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await ensureDbUser(userId);

  const user = await db.user.update({
    where: { id: userId },
    data: {
      xp: { increment: amount },
    },
  });

  const newLevel = Math.floor(user.xp / 1000) + 1;
  if (newLevel > user.level) {
    await db.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
  }

  revalidatePath('/profile');
  return { xp: user.xp, level: newLevel };
}

export async function fetchServerWatchlist() {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await db.watchlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: 'desc' },
  });

  return rows.map((row) => ({
    id: row.tmdbId,
    mediaType: (row.mediaType === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv',
    title: row.title,
    posterPath: row.poster,
  }));
}

export async function addToWatchlist(item: WatchlistPayload) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await ensureDbUser(userId);

  try {
    await db.watchlistItem.upsert({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId: item.tmdbId,
        },
      },
      update: {
        title: item.title,
        mediaType: item.mediaType,
        poster: item.poster,
      },
      create: {
        userId,
        ...item,
      },
    });

    await addXp(50, 'Added to watchlist');
  } catch (error) {
    console.error('Watchlist add error', error);
  }

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function removeFromWatchlist(tmdbId: number, mediaType: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.watchlistItem.deleteMany({
    where: { userId, tmdbId, mediaType },
  });

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function syncWatchlistItems(items: WatchlistPayload[]) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await ensureDbUser(userId);

  for (const item of items) {
    await db.watchlistItem.upsert({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId: item.tmdbId,
        },
      },
      update: {
        title: item.title,
        mediaType: item.mediaType,
        poster: item.poster,
      },
      create: {
        userId,
        ...item,
      },
    });
  }

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function updateCinephileDNA(genres: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const genreMap: Record<string, string> = {
    Action: 'action',
    Comedy: 'comedy',
    Drama: 'drama',
    Horror: 'horror',
    'Science Fiction': 'sciFi',
    Romance: 'romance',
    Thriller: 'thriller',
  };

  const updateData: Record<string, { increment: number }> = {};
  genres.forEach((g) => {
    const field = genreMap[g];
    if (field) {
      updateData[field] = { increment: 5 };
    }
  });

  if (Object.keys(updateData).length === 0) {
    return { updated: false };
  }

  await db.cinephileDNA.update({
    where: { userId },
    data: updateData,
  });

  await addXp(100, 'Engagement');

  return { updated: true };
}
