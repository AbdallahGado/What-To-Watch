import type { Metadata } from 'next';
import { getMovieDetails } from '@/lib/tmdb';
import { MovieDetails } from '@/features/title/movie-details';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const data = await getMovieDetails(params.id);
  const title = data.title ?? 'Movie';

  return {
    title: `${title} – What To Watch`,
    description: data.overview,
    openGraph: {
      title,
      description: data.overview
    }
  };
}

export default async function MoviePage({ params }: PageProps) {
  const data = await getMovieDetails(params.id);
  return <MovieDetails data={data} />;
}

