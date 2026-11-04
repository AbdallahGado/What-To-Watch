import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovieDetails } from '@/lib/tmdb';
import { MovieDetails } from '@/features/title/movie-details';
import { getReviews, getUserReview } from '@/app/actions/review';
import { parseTmdbId } from '@/lib/tmdb-id';
import { getSiteUrl } from '@/lib/site-url';
import { serializeJsonLd } from '@/lib/json-ld';

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: data.title,
            description: data.overview,
            url: new URL(`/movie/${data.id}`, getSiteUrl()).toString(),
            image: data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : undefined,
            datePublished: data.release_date || undefined,
            genre: data.genres?.map((genre) => genre.name),
            ...(data.vote_count && data.vote_count > 0
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: data.vote_average,
                    ratingCount: data.vote_count,
                    bestRating: 10,
                    worstRating: 0,
                  },
                }
              : {}),
          }),
        }}
      />
      <MovieDetails
        data={data}
        reviews={reviews}
        userReview={userReview}
        isSignedIn={Boolean(userId)}
      />
    </>
  );
}
