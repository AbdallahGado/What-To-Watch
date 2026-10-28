import Link from 'next/link';
import { ArrowUpRight, Clapperboard, Compass, Tv } from 'lucide-react';

const DISCOVERY_PATHS = [
  {
    href: '/movies',
    eyebrow: 'The big screen',
    title: 'Find a movie',
    description: 'Browse new releases, audience favorites, and hidden gems.',
    icon: Clapperboard,
    className: 'from-violet-500/20 via-purple-500/10 to-transparent',
  },
  {
    href: '/series',
    eyebrow: 'Your next obsession',
    title: 'Explore series',
    description: 'Find a story with enough episodes to stay awhile.',
    icon: Tv,
    className: 'from-teal-500/20 via-cyan-500/10 to-transparent',
  },
  {
    href: '/what-to-watch',
    eyebrow: 'Skip the scrolling',
    title: 'Get a match',
    description: 'Tell us your mood and we will find a place to start.',
    icon: Compass,
    className: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
];

export function ExploreMoreSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-6 py-10 md:py-14"
      aria-labelledby="explore-more-title"
    >
      <div className="mb-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-500">
          A good place to start
        </p>
        <h2 id="explore-more-title" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          What are you in the mood to explore?
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {DISCOVERY_PATHS.map(({ href, eyebrow, title, description, icon: Icon, className }) => (
          <Link
            key={href}
            href={href}
            className={`group relative min-h-48 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${className} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300`}
          >
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/[0.04] blur-2xl transition-colors group-hover:bg-white/[0.08]" />
            <div className="relative flex h-full min-h-36 flex-col justify-between gap-8">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-white/75" aria-hidden="true" />
                <ArrowUpRight
                  className="h-4 w-4 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  {eyebrow}
                </p>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-white/55">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
