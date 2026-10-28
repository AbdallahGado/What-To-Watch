import { getNowPlayingMovies } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MediaCardLink } from '@/app/components/MediaCardLink';

export async function NowPlayingSection() {
  const nowPlaying = await getNowPlayingMovies();

  return (
    <ScrollReveal delay={0.1}>
      <Section
        title="In theaters"
        eyebrow="On the big screen"
        description="See what is playing in cinemas right now."
        href="/movies"
      >
        {nowPlaying.map((item) => (
          <MediaCardLink key={item.id} item={item} />
        ))}
      </Section>
    </ScrollReveal>
  );
}
