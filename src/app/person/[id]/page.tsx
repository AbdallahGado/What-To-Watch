import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPersonDetails } from '@/lib/tmdb';
import { PersonDetails } from '@/features/person/person-details';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getPersonDetails(params.id);
  const title = data?.name ?? 'Person';
  const description = data?.biography?.slice(0, 160) ?? 'Person details.';

  return {
    title: `${title} - What To Watch`,
    description
  };
}

export default async function PersonPage({ params }: PageProps) {
  const data = await getPersonDetails(params.id);
  if (!data) notFound();
  return <PersonDetails data={data} />;
}
