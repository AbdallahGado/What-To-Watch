import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTvDetails } from '@/lib/tmdb';
import { TvDetails } from '@/features/title/tv-details';
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
  const data = await getTvDetails(params.id);
  const title = data?.name ?? 'Series';
  const description = data?.overview ?? 'Series details and reviews.';

  return {
    title,
    description,
    alternates: { canonical: `/tv/${encodeURIComponent(params.id)}` },
    openGraph: {
      title,
      description,
      type: 'video.tv_show',
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

export default async function TvPage({ params }: PageProps) {
  if (parseTmdbId(params.id) === null) notFound();
  const data = await getTvDetails(params.id);
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name: data.name,
            description: data.overview,
            url: new URL(`/tv/${data.id}`, getSiteUrl()).toString(),
            image: data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : undefined,
            datePublished: data.first_air_date || undefined,
            genre: data.genres?.map((genre) => genre.name),
            numberOfSeasons: data.number_of_seasons || undefined,
            numberOfEpisodes: data.number_of_episodes || undefined,
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
      <TvDetails data={data} />
    </>
  );
}
