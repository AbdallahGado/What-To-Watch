import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { parseReviewInput, ReviewInputError } from '@/lib/review-validation';
import { readJsonBody, RequestJsonError } from '@/lib/request-json';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await readJsonBody(request, 8192);
    } catch (error) {
      if (error instanceof RequestJsonError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      throw error;
    }

    let input;
    try {
      input = parseReviewInput(body);
    } catch (error) {
      if (error instanceof ReviewInputError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    const { tmdbId, mediaType, rating, reviewText } = input;

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
          mediaType,
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

    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Failed to save review', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
