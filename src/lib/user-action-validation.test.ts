import { describe, expect, it } from 'vitest';
import {
  MAX_WATCHLIST_SYNC_ITEMS,
  parseDnaGenres,
  parseWatchlistItem,
  parseWatchlistItems,
  parseWatchlistRemoval,
  UserActionInputError,
} from './user-action-validation';

const validWatchlistItem = {
  tmdbId: 42,
  title: 'Example',
  mediaType: 'movie',
  poster: '/example-poster.jpg',
};

describe('watchlist action validation', () => {
  it('normalizes valid item data', () => {
    expect(parseWatchlistItem({ ...validWatchlistItem, title: ' Example ' })).toEqual({
      ...validWatchlistItem,
      title: 'Example',
    });
  });

  it.each([
    null,
    { ...validWatchlistItem, tmdbId: -1 },
    { ...validWatchlistItem, tmdbId: 1.5 },
    { ...validWatchlistItem, mediaType: 'person' },
    { ...validWatchlistItem, title: ' ' },
    { ...validWatchlistItem, title: 'x'.repeat(201) },
    { ...validWatchlistItem, poster: 'https://attacker.example/image.png' },
    { ...validWatchlistItem, poster: '/../secret' },
  ])('rejects invalid watchlist item input', (item) => {
    expect(() => parseWatchlistItem(item)).toThrow(UserActionInputError);
  });

  it('limits sync batch size and duplicate IDs', () => {
    expect(() =>
      parseWatchlistItems(Array.from({ length: MAX_WATCHLIST_SYNC_ITEMS + 1 }, (_, index) => ({
        ...validWatchlistItem,
        tmdbId: index + 1,
      })))
    ).toThrow(UserActionInputError);
    expect(() => parseWatchlistItems([validWatchlistItem, validWatchlistItem])).toThrow(
      UserActionInputError
    );
  });

  it('validates removal and deduplicates selected genres', () => {
    expect(parseWatchlistRemoval(42, 'tv')).toEqual({ tmdbId: 42, mediaType: 'tv' });
    expect(parseDnaGenres(['Action', 'Action', 'Drama'])).toEqual(['Action', 'Drama']);
    expect(() => parseWatchlistRemoval(42, 'person')).toThrow(UserActionInputError);
    expect(() => parseDnaGenres(['Action', 'unknown'])).toThrow(UserActionInputError);
  });
});
