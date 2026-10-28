import { getUpcomingMovies } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MediaCardLink } from '@/app/components/MediaCardLink';

export async function UpcomingSection() {
  const upcoming = await getUpcomingMovies();

  return (
    <ScrollReveal delay={0.2}>
      <Section
        title="Coming soon"
        eyebrow="Add to your watch radar"
        description="A first look at movies on the way."
        href="/movies"
      >
        {upcoming.map((item) => (
          <MediaCardLink key={item.id} item={item} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
