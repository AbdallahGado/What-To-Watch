import { getPopularPeople } from '@/lib/tmdb';
import { ActorCard } from '@/app/components/ActorCard';
import Link from 'next/link';

export async function PopularPeopleSection() {
  const people = await getPopularPeople();

  return (
    <section className="py-8 max-w-7xl mx-auto px-6">
      <h2 className="text-2xl md:text-3xl font-light text-white mb-8 tracking-wide">
        Popular Stars
      </h2>
      <div className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar">
        {people.map((person) => (
          <Link key={person.id} href={`/person/${person.id}` as any}>
            <ActorCard person={person} />
          </Link>
        ))}
      </div>
    </section>
  );
}
