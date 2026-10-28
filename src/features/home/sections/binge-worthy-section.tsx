import { getPopularTv } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MediaCardLink } from '@/app/components/MediaCardLink';

export async function BingeWorthySection() {
  const series = await getPopularTv();

  if (series.length === 0) return null;

  return (
    <ScrollReveal delay={0.2}>
      <Section
        title="Your next series"
        eyebrow="One more episode"
        description="Popular shows worth settling in for."
        href="/series"
      >
        {series.map((item) => (
          <MediaCardLink key={item.id} item={{ ...item, media_type: 'tv' }} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
