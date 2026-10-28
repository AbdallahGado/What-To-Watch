import { getTrending } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MediaCardLink } from '@/app/components/MediaCardLink';

export async function TrendingSection() {
  const trending = await getTrending();

  return (
    <ScrollReveal delay={0}>
      <Section
        title="Trending now"
        eyebrow="The conversation"
        description="Popular picks making waves with movie and TV fans."
        href="/movies"
      >
        {trending.map((item) => (
          <MediaCardLink key={item.id} item={item} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
