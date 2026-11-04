import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPersonDetails } from '@/lib/tmdb';
import { PersonDetails } from '@/features/person/person-details';
import { parseTmdbId } from '@/lib/tmdb-id';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (parseTmdbId(params.id) === null) notFound();
  const data = await getPersonDetails(params.id);
  const title = data?.name ?? 'Person';
  const description = data?.biography?.slice(0, 160) ?? 'Person details.';

  return {
    title,
    description,
    alternates: { canonical: `/person/${encodeURIComponent(params.id)}` },
    openGraph: {
      title,
      description,
      type: 'profile',
      ...(data?.profile_path && {
        images: [`https://image.tmdb.org/t/p/w780${data.profile_path}`],
      }),
    },
    twitter: {
      card: data?.profile_path ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(data?.profile_path && {
        images: [`https://image.tmdb.org/t/p/w780${data.profile_path}`],
      }),
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  if (parseTmdbId(params.id) === null) notFound();
  const data = await getPersonDetails(params.id);
  if (!data) notFound();
  return <PersonDetails data={data} />;
}
