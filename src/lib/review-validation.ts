export const MAX_REVIEW_LENGTH = 1000;

export interface ReviewInput {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  rating: number;
  reviewText: string | null;
}

export class ReviewInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewInputError';
  }
}

export function parseReviewInput(value: unknown): ReviewInput {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ReviewInputError('Review data must be an object.');
  }

  const input = value as Record<string, unknown>;
  if (
    typeof input.tmdbId !== 'number' ||
    !Number.isSafeInteger(input.tmdbId) ||
    input.tmdbId <= 0
  ) {
    throw new ReviewInputError('A valid title ID is required.');
  }

  if (input.mediaType !== 'movie' && input.mediaType !== 'tv') {
    throw new ReviewInputError('Media type must be movie or tv.');
  }

  if (
    typeof input.rating !== 'number' ||
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new ReviewInputError('Rating must be an integer between 1 and 5.');
  }

  const reviewText = input.reviewText ?? input.review;
  if (
    reviewText !== undefined &&
    reviewText !== null &&
    (typeof reviewText !== 'string' || reviewText.length > MAX_REVIEW_LENGTH)
  ) {
    throw new ReviewInputError(`Review text must be ${MAX_REVIEW_LENGTH} characters or fewer.`);
  }

  return {
    tmdbId: input.tmdbId,
    mediaType: input.mediaType,
    rating: input.rating,
    reviewText: typeof reviewText === 'string' && reviewText.trim() ? reviewText.trim() : null,
  };
}
