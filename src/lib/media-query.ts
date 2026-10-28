import type { TMDBMedia } from './tmdb-types';

export type ListingMediaType = 'movie' | 'tv';

export interface MediaQuery {
  type: ListingMediaType;
  genre: string;
  sort: string;
  page: number;
}

const SORT_OPTIONS: Record<ListingMediaType, readonly string[]> = {
  movie: ['popularity.desc', 'vote_average.desc', 'primary_release_date.desc'],
  tv: ['popularity.desc', 'vote_average.desc', 'first_air_date.desc'],
};

export class MediaQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MediaQueryError';
  }
}

function isTMDBMedia(item: unknown): item is TMDBMedia {
  if (typeof item !== 'object' || item === null) return false;
  if (
    !('id' in item) ||
    typeof item.id !== 'number' ||
    !Number.isSafeInteger(item.id) ||
    !('overview' in item) ||
    typeof item.overview !== 'string' ||
    !('poster_path' in item) ||
    (typeof item.poster_path !== 'string' && item.poster_path !== null) ||
    !('backdrop_path' in item) ||
    (typeof item.backdrop_path !== 'string' && item.backdrop_path !== null) ||
    !('vote_average' in item) ||
    typeof item.vote_average !== 'number' ||
    !Number.isFinite(item.vote_average)
  ) {
    return false;
  }

  return (
    (!('title' in item) || typeof item.title === 'string') &&
    (!('name' in item) || typeof item.name === 'string') &&
    (!('media_type' in item) || item.media_type === 'movie' || item.media_type === 'tv')
  );
}

export function parseMediaResults(data: unknown): TMDBMedia[] {
  if (!Array.isArray(data) || !data.every(isTMDBMedia)) {
    throw new Error('The media service returned an invalid response.');
  }

  return data;
}

export function parseMediaQuery(searchParams: URLSearchParams): MediaQuery {
  const type = searchParams.get('type') ?? 'movie';
  if (type !== 'movie' && type !== 'tv') {
    throw new MediaQueryError('Type must be movie or tv.');
  }

  const genre = searchParams.get('genre') ?? 'all';
  if (
    genre !== 'all' &&
    (!/^[1-9]\d*$/.test(genre) || !Number.isSafeInteger(Number(genre)))
  ) {
    throw new MediaQueryError('Genre must be all or a valid genre ID.');
  }

  const sort = searchParams.get('sort') ?? 'popularity.desc';
  if (!SORT_OPTIONS[type].includes(sort)) {
    throw new MediaQueryError('Sort option is not supported for this media type.');
  }

  const rawPage = searchParams.get('page') ?? '1';
  const page = Number(rawPage);
  if (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(page) || page > 500) {
    throw new MediaQueryError('Page must be an integer between 1 and 500.');
  }

  return { type, genre, sort, page };
}
