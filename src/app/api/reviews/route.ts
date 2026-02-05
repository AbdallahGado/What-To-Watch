import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tmdbId, mediaType, rating, reviewText } = body as {
      tmdbId: number;
      mediaType: 'movie' | 'tv';
      rating: number;
      reviewText?: string;
    };

    if (!tmdbId || !mediaType || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const existingReview = await db.userReview.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId
        }
      }
    });

    if (existingReview) {
      await db.userReview.update({
        where: { id: existingReview.id },
        data: {
          rating,
          reviewText: reviewText ?? null
        }
      });
    } else {
      await db.userReview.create({
        data: {
          userId,
          tmdbId,
          mediaType,
          rating,
          reviewText: reviewText ?? null
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
