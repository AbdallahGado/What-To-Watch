import { getNowPlayingMovies } from '@/lib/tmdb';
import { Section } from '@/app/components/Section';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { MovieCard } from '@/app/components/MovieCard';
import { toCardData, getMediaHref } from '@/lib/media';
import Link from 'next/link';

export async function NowPlayingSection() {
  const nowPlaying = await getNowPlayingMovies();

  return (
    <ScrollReveal delay={0.1}>
      <Section title="In Theaters">
        {nowPlaying.map((item) => (
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
