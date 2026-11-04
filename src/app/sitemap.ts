import type { MetadataRoute } from 'next';
import { getPopularPeople, getPopularTv, getTopRatedMovies, getTrending } from '@/lib/tmdb';
import { getSiteUrl } from '@/lib/site-url';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [trending, movies, series, people] = await Promise.all([
    getTrending(),
    getTopRatedMovies(),
    getPopularTv(),
    getPopularPeople(),
  ]);
  const mediaRoutes = new Map<string, string>();

  for (const item of [...trending, ...movies, ...series]) {
    if (!Number.isSafeInteger(item.id) || item.id <= 0) continue;
    const type = item.media_type ?? (item.name ? 'tv' : 'movie');
    mediaRoutes.set(`${type}:${item.id}`, `/${type}/${item.id}`);
  }

  const routes = [
    '/',
    '/movies',
    '/series',
    '/what-to-watch',
    ...mediaRoutes.values(),
    ...people
      .filter((person) => Number.isSafeInteger(person.id) && person.id > 0)
      .map((person) => `/person/${person.id}`),
  ];

  return routes.map((path) => ({ url: new URL(path, base).toString() }));
}
