import type { Metadata } from 'next';
import { getTvDetails } from '@/lib/tmdb';
import { TvDetails } from '@/features/title/tv-details';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const data = await getTvDetails(params.id);
  const title = data.name ?? 'Series';

  return {
    title: `${title} – What To Watch`,
    description: data.overview,
    openGraph: {
      title,
      description: data.overview
    }
  };
}

export default async function TvPage({ params }: PageProps) {
  const data = await getTvDetails(params.id);
  return <TvDetails data={data} />;
}

