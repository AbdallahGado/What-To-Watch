import type { Metadata } from 'next';
import { getPersonDetails } from '@/lib/tmdb';
import { PersonDetails } from '@/features/person/person-details';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const data = await getPersonDetails(params.id);

  return {
    title: `${data.name} – What To Watch`,
    description: data.biography?.slice(0, 160)
  };
}

export default async function PersonPage({ params }: PageProps) {
  const data = await getPersonDetails(params.id);
  return <PersonDetails data={data} />;
}

