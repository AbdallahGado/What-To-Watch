import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTvDetails } from '@/lib/tmdb';
import { TvDetails } from '@/features/title/tv-details';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getTvDetails(params.id);
  const title = data?.name ?? 'Series';
  const description = data?.overview ?? 'Series details and reviews.';

  return {
    title: `${title} - What To Watch`,
    description,
    openGraph: {
      title,
      description
    }
  };
}

export default async function TvPage({ params }: PageProps) {
  const data = await getTvDetails(params.id);
  if (!data) notFound();
  return <TvDetails data={data} />;
}
