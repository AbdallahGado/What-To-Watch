export const MAX_WATCHLIST_SYNC_ITEMS = 200;

export interface WatchlistInput {
  tmdbId: number;
  title: string;
  mediaType: 'movie' | 'tv';
  poster: string | null;
}

export class UserActionInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserActionInputError';
  }
}

export function parseWatchlistItem(value: unknown): WatchlistInput {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new UserActionInputError('Watchlist item must be an object.');
  }

  const item = value as Record<string, unknown>;
  if (
    typeof item.tmdbId !== 'number' ||
    !Number.isSafeInteger(item.tmdbId) ||
    item.tmdbId <= 0
  ) {
    throw new UserActionInputError('A valid title ID is required.');
  }

  if (item.mediaType !== 'movie' && item.mediaType !== 'tv') {
    throw new UserActionInputError('Media type must be movie or tv.');
  }

  if (typeof item.title !== 'string' || !item.title.trim() || item.title.trim().length > 200) {
    throw new UserActionInputError('Title must be between 1 and 200 characters.');
  }

  if (
    item.poster !== null &&
    (typeof item.poster !== 'string' || !/^\/[A-Za-z0-9._-]{1,200}$/.test(item.poster))
  ) {
    throw new UserActionInputError('Poster path is invalid.');
  }

  return {
    tmdbId: item.tmdbId,
    title: item.title.trim(),
    mediaType: item.mediaType,
    poster: item.poster,
  };
}

export function parseWatchlistItems(value: unknown): WatchlistInput[] {
  if (!Array.isArray(value) || value.length > MAX_WATCHLIST_SYNC_ITEMS) {
    throw new UserActionInputError(
      `Watchlist sync must contain at most ${MAX_WATCHLIST_SYNC_ITEMS} items.`
    );
  }

  const items = value.map(parseWatchlistItem);
  if (new Set(items.map((item) => item.tmdbId)).size !== items.length) {
    throw new UserActionInputError('Watchlist sync cannot contain duplicate title IDs.');
  }

  return items;
}

export function parseWatchlistRemoval(tmdbId: unknown, mediaType: unknown) {
  if (typeof tmdbId !== 'number' || !Number.isSafeInteger(tmdbId) || tmdbId <= 0) {
    throw new UserActionInputError('A valid title ID is required.');
  }
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    throw new UserActionInputError('Media type must be movie or tv.');
  }
  return { tmdbId, mediaType };
}

const DNA_GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Science Fiction',
  'Romance',
  'Thriller',
] as const;

export type DnaGenre = (typeof DNA_GENRES)[number];

export function parseDnaGenres(value: unknown): DnaGenre[] {
  if (!Array.isArray(value) || value.length > DNA_GENRES.length) {
    throw new UserActionInputError('Select valid Cinephile DNA genres.');
  }
  if (!value.every((genre): genre is DnaGenre => DNA_GENRES.includes(genre))) {
    throw new UserActionInputError('Select valid Cinephile DNA genres.');
  }
  return [...new Set(value)];
}
