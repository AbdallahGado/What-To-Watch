'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addReview(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  rating: number,
  review?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  if (!tmdbId || !mediaType || !rating) {
    throw new Error('Missing required fields');
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  try {
    const existingReview = await db.userReview.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId,
        },
      },
    });

    if (existingReview) {
      await db.userReview.update({
        where: { id: existingReview.id },
        data: {
          rating,
          reviewText: review ?? null,
        },
      });
    } else {
      await db.userReview.create({
        data: {
          userId,
          tmdbId,
          mediaType,
          rating,
          reviewText: review ?? null,
        },
      });
    }

    revalidatePath(`/${mediaType}/${tmdbId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to add review:', error);
    throw new Error('Failed to add review');
  }
}

export async function getReviews(tmdbId: number) {
  if (!tmdbId) return [];

  try {
    return await db.userReview.findMany({
      where: { tmdbId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}

export async function getUserReview(tmdbId: number) {
  const { userId } = await auth();
  if (!userId || !tmdbId) return null;

  try {
    return await db.userReview.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId,
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch user review:', error);
    return null;
  }
}

export async function deleteReview(reviewId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  if (!reviewId) throw new Error('Missing review id');

  try {
    const review = await db.userReview.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== userId) {
      throw new Error('Review not found or unauthorized');
    }

    await db.userReview.delete({
      where: { id: reviewId },
    });

    revalidatePath(`/${review.mediaType}/${review.tmdbId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw new Error('Failed to delete review');
  }
}

