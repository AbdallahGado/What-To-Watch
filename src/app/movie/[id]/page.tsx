import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovieDetails } from '@/lib/tmdb';
import { MovieDetails } from '@/features/title/movie-details';
import { getReviews, getUserReview } from '@/app/actions/review';
import { parseTmdbId } from '@/lib/tmdb-id';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (parseTmdbId(params.id) === null) notFound();
  const data = await getMovieDetails(params.id);
  const title = data?.title ?? 'Movie';
  const description = data?.overview ?? 'Movie details and reviews.';

  return {
    title,
    description,
    alternates: { canonical: `/movie/${encodeURIComponent(params.id)}` },
    openGraph: {
      title,
      description,
      type: 'video.movie',
      ...(data?.backdrop_path && {
        images: [`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`],
      }),
    },
    twitter: {
      card: data?.backdrop_path ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(data?.backdrop_path && {
        images: [`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`],
      }),
    }
  };
}

export default async function MoviePage({ params }: PageProps) {
  const tmdbId = parseTmdbId(params.id);
  if (tmdbId === null) notFound();

  const data = await getMovieDetails(params.id);
  if (!data) notFound();
  const { userId } = await auth();
  const [reviews, userReview] = await Promise.all([
    getReviews(tmdbId),
    getUserReview(tmdbId)
  ]);

  return (
    <MovieDetails
      data={data}
      reviews={reviews}
      userReview={userReview}
      isSignedIn={Boolean(userId)}
    />
  );
}
