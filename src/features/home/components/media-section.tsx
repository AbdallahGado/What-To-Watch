import type { TMDBMedia } from '@/lib/tmdb-types';
import { Section } from '@/app/components/Section';
import { MediaCardLink } from '@/app/components/MediaCardLink';
import { ScrollReveal } from '@/app/components/ScrollReveal';

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
          <MediaCardLink key={item.id} item={item} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
