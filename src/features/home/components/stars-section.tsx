import Link from 'next/link';
import { TMDBPerson } from '@/lib/tmdb';
import { ActorCard } from '@/app/components/ActorCard';
import { ScrollReveal } from '@/app/components/ScrollReveal';

interface StarsSectionProps {
  fetchData: () => Promise<TMDBPerson[]>;
}

export async function StarsSection({ fetchData }: StarsSectionProps) {
  const people = await fetchData();

  return (
    <ScrollReveal delay={0.25}>
        <section className="py-8 max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-8 tracking-wide">
                Popular Stars
            </h2>
            <div className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar">
                {people.map((person) => (
                    <Link key={person.id} href={`/person/${person.id}`}>
                        <ActorCard person={person} />
                    </Link>
                ))}
            </div>
        </section>
    </ScrollReveal>
  );
}
