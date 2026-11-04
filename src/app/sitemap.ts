import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = [
    { path: '/', priority: 1, changeFrequency: 'daily' as const },
    { path: '/movies', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/series', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/what-to-watch', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, base).toString(),
    changeFrequency,
    priority,
  }));
}
