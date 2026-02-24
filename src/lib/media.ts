import type { TMDBMedia, TMDBMediaType } from './tmdb-types';

export function getMediaTitle(media: TMDBMedia) {
  return media.title ?? media.name ?? 'Untitled';
}

export function getMediaYear(media: TMDBMedia) {
  return (media.release_date ?? media.first_air_date)?.split('-')[0];
}

export function getMediaType(media: TMDBMedia, fallback: TMDBMediaType = 'movie') {
  return media.media_type ?? fallback;
}

export function getMediaHref(media: TMDBMedia, fallback: TMDBMediaType = 'movie') {
  return getMediaType(media, fallback) === 'tv' ? `/tv/${media.id}` : `/movie/${media.id}`;
}

export function toCardData(media: TMDBMedia) {
  return {
    id: media.id,
    title: getMediaTitle(media),
    poster_path: media.poster_path,
    vote_average: media.vote_average,
    year: getMediaYear(media)
  };
}
