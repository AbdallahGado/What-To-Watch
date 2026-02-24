import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovieDetails } from '@/lib/tmdb';
import { MovieDetails } from '@/features/title/movie-details';
import { getReviews, getUserReview } from '@/app/actions/review';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getMovieDetails(params.id);
  const title = data?.title ?? 'Movie';
  const description = data?.overview ?? 'Movie details and reviews.';

  return {
    title: `${title} - What To Watch`,
    description,
    openGraph: {
      title,
      description
    }
  };
}

export default async function MoviePage({ params }: PageProps) {
  const tmdbId = Number(params.id);
  if (Number.isNaN(tmdbId)) notFound();

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
