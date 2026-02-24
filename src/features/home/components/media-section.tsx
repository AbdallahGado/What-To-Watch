import Link from 'next/link';
import type { TMDBMedia } from '@/lib/tmdb-types';
import { Section } from '@/app/components/Section';
import { MovieCard } from '@/app/components/MovieCard';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { getMediaHref, toCardData } from '@/lib/media';

interface MediaSectionProps {
  title: string;
  fetchData: () => Promise<TMDBMedia[]>;
}

export async function MediaSection({ title, fetchData }: MediaSectionProps) {
  const items = await fetchData();

  if (!items?.length) return null;

  return (
    <ScrollReveal>
      <Section title={title}>
        {items.map((item) => (
          <Link key={item.id} href={getMediaHref(item)} className="scroll-snap-align-start shrink-0">
            <MovieCard tmdb={toCardData(item)} variant="portrait" />
          </Link>
        ))}
      </Section>
    </ScrollReveal>
  );
}
