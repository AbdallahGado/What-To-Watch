import { getTopRatedMovies } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MovieCard } from '@/app/components/MovieCard';
import { toCardData, getMediaHref } from '@/lib/media';
import Link from 'next/link';

export async function TopRatedSection() {
  const topRated = await getTopRatedMovies();

  return (
    <ScrollReveal delay={0.25}>
      <Section title="Top Rated Classics">
        {topRated.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[200px] md:w-[240px] px-2">
            <Link href={getMediaHref(item) as any}>
              <MovieCard tmdb={toCardData(item)} variant="portrait" />
            </Link>
          </div>
        ))}
      </Section>
    </ScrollReveal>
  );
}
