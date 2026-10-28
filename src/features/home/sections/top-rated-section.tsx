import { getTopRatedMovies } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MediaCardLink } from '@/app/components/MediaCardLink';

export async function TopRatedSection() {
  const topRated = await getTopRatedMovies();

  return (
    <ScrollReveal delay={0.25}>
      <Section
        title="Worth your time"
        eyebrow="Audience favorites"
        description="Highly rated movies that have stood out with viewers."
        href="/movies"
      >
        {topRated.map((item) => (
          <MediaCardLink key={item.id} item={item} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
