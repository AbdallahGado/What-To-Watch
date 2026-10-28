import { getPopularPeople } from '@/lib/tmdb';
import { ActorCard } from '@/app/components/ActorCard';
import Link from 'next/link';

export async function PopularPeopleSection() {
  const people = await getPopularPeople();

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 md:py-10" aria-labelledby="popular-people-title">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500 mb-2">
          Behind the stories
        </p>
        <h2 id="popular-people-title" className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          People to know
        </h2>
      </div>
      <div
        className="flex gap-5 md:gap-7 overflow-x-auto pb-4 -mx-6 px-6 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        role="region"
        aria-label="Popular people, scrollable"
        tabIndex={0}
      >
        {people.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="w-28 md:w-32 shrink-0 snap-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <ActorCard person={person} />
          </Link>
        ))}
        </div>
    </section>
  );
}
