import type { ReactNode } from 'react';
import { BookmarkCheck, Clapperboard, Sparkles } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';

interface AuthPageLayoutProps {
  children: ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent-500/10 blur-[130px]" />
      </div>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-10 pt-28 sm:px-6 md:pt-32"
      >
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/30 lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.9fr)]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-500/15 via-[#11131a] to-accent-500/10 p-8 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.07]" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/[0.07]" aria-hidden="true" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-300/10 px-3 py-1.5 text-xs font-medium text-brand-100">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Your movie night starts here
              </span>
              <h1 className="mt-8 max-w-lg font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Find something worth watching.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/60 sm:text-lg">
                Save the movies and series you love, get inspired, and make your next pick with confidence.
              </p>
            </div>

            <div className="relative mt-10 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-400/15 text-brand-200">
                  <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-white/80">Keep your watchlist close</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-500">
                  <Clapperboard className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-white/80">Discover your next favorite</span>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center border-t border-white/10 bg-black/20 p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-12">
            <div className="w-full max-w-[420px]">{children}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
