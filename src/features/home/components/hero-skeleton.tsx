export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-slate-950 animate-pulse overflow-hidden">
        {/* Skeleton content for Hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 opacity-50" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-32 md:pb-40">
            <div className="h-6 w-32 bg-white/5 rounded-full mb-6" />
            <div className="h-20 md:h-32 w-2/3 bg-white/10 rounded-2xl mb-6" />
            <div className="h-6 w-1/2 bg-white/5 rounded-full mb-10" />
            <div className="flex gap-4">
                <div className="h-14 w-40 bg-white/10 rounded-2xl" />
                <div className="h-14 w-14 bg-white/5 rounded-2xl" />
            </div>
        </div>
    </div>
  );
}
