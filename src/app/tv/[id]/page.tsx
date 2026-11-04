import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTvDetails } from '@/lib/tmdb';
import { TvDetails } from '@/features/title/tv-details';
import { parseTmdbId } from '@/lib/tmdb-id';

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
  return <TvDetails data={data} />;
}
