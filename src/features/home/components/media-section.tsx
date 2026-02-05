import Link from 'next/link';
import { TMDBMedia } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { MovieCard } from '@/app/components/MovieCard';
import { ScrollReveal } from '@/app/components/ScrollReveal';

interface MediaSectionProps {
  title: string;
  fetchData: () => Promise<TMDBMedia[]>;
}

export async function MediaSection({ title, fetchData }: MediaSectionProps) {
  const items = await fetchData();

  if (!items || items.length === 0) return null;

  return (
    <ScrollReveal>
      <Section title={title}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={
              item.media_type === 'tv'
                ? `/tv/${item.id}`
                : `/movie/${item.id}`
            }
            className="scroll-snap-align-start shrink-0"
          >
            <MovieCard
              tmdb={{
                id: item.id,
                title: item.title ?? item.name ?? '',
                poster_path: item.poster_path,
                vote_average: item.vote_average
              }}
              variant="portrait"
            />
          </Link>
        ))}
      </Section>
    </ScrollReveal>
  );
}
