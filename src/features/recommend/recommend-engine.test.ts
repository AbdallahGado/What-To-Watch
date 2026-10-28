import { describe, expect, it } from 'vitest';
import { MOOD_CONFIGS } from '@/lib/recommendation-data';
import { calculateMatchScore, type TMDBMedia } from '@/lib/tmdb';

function makeItem(overrides: Partial<TMDBMedia> = {}): TMDBMedia {
  return {
    id: 1,
    media_type: 'movie',
    title: 'Test Title',
    overview: '',
    poster_path: '/x.jpg',
    vote_average: 7,
    vote_count: 500,
    genre_ids: [18],
    ...overrides,
  } as TMDBMedia;
}

describe('calculateMatchScore', () => {
  const nostalgic = MOOD_CONFIGS.nostalgic;

  it('awards the era bonus when the item is inside the configured era', () => {
    const inEra = makeItem({ release_date: '1995-06-01' });
    const outOfEra = makeItem({ release_date: '2024-06-01' });

    const inScore = calculateMatchScore(inEra, nostalgic, [12, 10751], [18], false);
    const outScore = calculateMatchScore(outOfEra, nostalgic, [12, 10751], [18], false);

    expect(outScore - inScore).toBe(-5);
  });

  it('awards more score for a larger genre overlap', () => {
    const fullMatch = makeItem({ genre_ids: [12, 10751, 14, 28] });
    const noMatch = makeItem({ genre_ids: [284] });

    const fullScore = calculateMatchScore(fullMatch, nostalgic, [12, 10751, 14, 28], [], false);
    const noScore = calculateMatchScore(noMatch, nostalgic, [12, 10751, 14, 28], [], false);

    expect(fullScore).toBeGreaterThan(noScore);
  });

  it('rewards a user-specific genre', () => {
    const withoutUserGenre = makeItem();
    const withUserGenre = makeItem({ genre_ids: [18] });

    const without = calculateMatchScore(withoutUserGenre, nostalgic, [12, 10751], [], false);
    const withUserGenreScore = calculateMatchScore(withUserGenre, nostalgic, [12, 10751], [18], false);

    expect(withUserGenreScore - without).toBe(10);
  });

  it('rewards a friend-friendly title', () => {
    const soloMovie = makeItem({ vote_average: 8, vote_count: 1000 });
    const withFriends = makeItem({ vote_average: 8, vote_count: 1000 });

    const solo = calculateMatchScore(soloMovie, nostalgic, [12, 10751], [18], false);
    const friends = calculateMatchScore(withFriends, nostalgic, [12, 10751], [18], true);

    expect(friends - solo).toBe(5);
  });

  it('returns the same score for identical inputs', () => {
    const a = makeItem({ id: 10 });
    const b = makeItem({ id: 11 });

    const scoreA = calculateMatchScore(a, nostalgic, [12, 10751], [], false);
    const scoreB = calculateMatchScore(b, nostalgic, [12, 10751], [], false);

    expect(scoreA).toBe(scoreB);
  });
});