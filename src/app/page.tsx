import { HomeShell } from '@/features/home/home-shell';
import { getTrending, getTopRatedMovies, getPopularPeople, getUpcomingMovies, getNowPlayingMovies } from '@/lib/tmdb';

export default async function HomePage() {
  const [trending, topRated, people, upcoming, nowPlaying] = await Promise.all([
    getTrending(),
    getTopRatedMovies(),
    getPopularPeople(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <HomeShell
      trending={trending}
      topRated={topRated}
      people={people}
      upcoming={upcoming}
      nowPlaying={nowPlaying}
    />
  );
}

