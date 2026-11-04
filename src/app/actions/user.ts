'use server';

import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ensureDbUser } from '@/lib/ensure-user';
import {
  parseDnaGenres,
  parseWatchlistItem,
  parseWatchlistItems,
  parseWatchlistRemoval,
} from '@/lib/user-action-validation';

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

export async function addToWatchlist(value: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const item = parseWatchlistItem(value);

  await ensureDbUser(userId);

  try {
    await db.$transaction(async (transaction) => {
      await transaction.watchlistItem.create({
        data: { userId, ...item },
      });

      const user = await transaction.user.update({
        where: { id: userId },
        data: { xp: { increment: 50 } },
      });
      const newLevel = Math.floor(user.xp / 1000) + 1;
      if (newLevel > user.level) {
        await transaction.user.update({
          where: { id: userId },
          data: { level: newLevel },
        });
      }
    });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error;
    }
    await db.watchlistItem.update({
      where: { userId_tmdbId: { userId, tmdbId: item.tmdbId } },
      data: { title: item.title, mediaType: item.mediaType, poster: item.poster },
    });
  }

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function removeFromWatchlist(tmdbId: unknown, mediaType: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const item = parseWatchlistRemoval(tmdbId, mediaType);

  await db.watchlistItem.deleteMany({
    where: { userId, ...item },
  });

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function syncWatchlistItems(value: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const items = parseWatchlistItems(value);

  await ensureDbUser(userId);

  await db.$transaction(
    items.map((item) =>
      db.watchlistItem.upsert({
        where: { userId_tmdbId: { userId, tmdbId: item.tmdbId } },
        update: {
          title: item.title,
          mediaType: item.mediaType,
          poster: item.poster,
        },
        create: { userId, ...item },
      })
    )
  );

  revalidatePath('/collection');
  revalidatePath('/profile');
}

export async function updateCinephileDNA(value: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const selectedGenres = parseDnaGenres(value);
  if (selectedGenres.length === 0) return { updated: false };

  const genreMap = {
    Action: 'action',
    Comedy: 'comedy',
    Drama: 'drama',
    Horror: 'horror',
    'Science Fiction': 'sciFi',
    Romance: 'romance',
    Thriller: 'thriller',
  } as const;
  type DnaField = (typeof genreMap)[keyof typeof genreMap];
  const fields: DnaField[] = selectedGenres.map((genre) => genreMap[genre]);

  await ensureDbUser(userId);
  await db.$transaction(async (transaction) => {
    const dna = await transaction.cinephileDNA.findUniqueOrThrow({ where: { userId } });
    const updateData: Partial<Record<DnaField, number>> = {};
    for (const field of fields) {
      updateData[field] = Math.min(100, dna[field] + 5);
    }
    await transaction.cinephileDNA.update({ where: { userId }, data: updateData });
  });
  return { updated: true };
}
