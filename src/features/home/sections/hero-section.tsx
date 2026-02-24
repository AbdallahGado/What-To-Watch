import { getTrending } from '@/lib/tmdb';
import { HeroCarousel } from '@/features/home/components/hero-carousel';

export async function HeroSection() {
  const trending = await getTrending();
  const heroItems = trending.slice(0, 5);

  if (heroItems.length === 0) return null;

  return <HeroCarousel items={heroItems} />;
}
