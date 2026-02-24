export type TmdbImageSize = 'w185' | 'w300' | 'w342' | 'w500' | 'original';

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: TmdbImageSize = 'w500'
): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getPosterUrl(path: string | null | undefined, size: TmdbImageSize = 'w500') {
  return getTmdbImageUrl(path, size);
}

export function getBackdropUrl(path: string | null | undefined, size: TmdbImageSize = 'original') {
  return getTmdbImageUrl(path, size);
}

export function getProfileUrl(path: string | null | undefined, size: TmdbImageSize = 'w185') {
  return getTmdbImageUrl(path, size);
}
