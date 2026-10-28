import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">404</p>
        <h1 className="text-3xl md:text-4xl font-display font-light">Page not found</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          That route does not exist. Browse Discover, or jump into Mood Match to find something worth watching.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/what-to-watch"
            className="px-5 py-3 rounded-2xl border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Mood Match
          </Link>
        </div>
      </div>
    </div>
  );
}
