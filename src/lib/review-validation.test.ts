import { describe, expect, it } from 'vitest';
import { MAX_REVIEW_LENGTH, parseReviewInput, ReviewInputError } from './review-validation';

describe('parseReviewInput', () => {
  it('normalizes valid review input', () => {
    expect(
      parseReviewInput({
        tmdbId: 42,
        mediaType: 'movie',
        rating: 5,
        reviewText: '  Loved it.  ',
      })
    ).toEqual({
      tmdbId: 42,
      mediaType: 'movie',
      rating: 5,
      reviewText: 'Loved it.',
    });
  });

  it('accepts a missing review as null', () => {
    expect(parseReviewInput({ tmdbId: 42, mediaType: 'tv', rating: 1 }).reviewText).toBeNull();
  });

  it.each([
    null,
    [],
    { tmdbId: 0, mediaType: 'movie', rating: 3 },
    { tmdbId: 1.5, mediaType: 'movie', rating: 3 },
    { tmdbId: 1, mediaType: 'person', rating: 3 },
    { tmdbId: 1, mediaType: 'movie', rating: 3.5 },
    { tmdbId: 1, mediaType: 'movie', rating: 6 },
    {
      tmdbId: 1,
      mediaType: 'movie',
      rating: 3,
      reviewText: 'x'.repeat(MAX_REVIEW_LENGTH + 1),
    },
  ])('rejects invalid review input', (input) => {
    expect(() => parseReviewInput(input)).toThrow(ReviewInputError);
  });
});
