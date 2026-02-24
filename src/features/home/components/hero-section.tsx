import type { TMDBMedia } from '@/lib/tmdb-types';
import { HeroCarousel } from './hero-carousel';

interface HeroSectionProps {
  fetchTrending: () => Promise<TMDBMedia[]>;
}

export async function HeroSection({ fetchTrending }: HeroSectionProps) {
  const trending = await fetchTrending();
  const heroItems = trending.slice(0, 5); // Rotate top 5

  if (heroItems.length === 0) return null;

  return <HeroCarousel items={heroItems} />;
}
