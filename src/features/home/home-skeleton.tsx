export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background text-white pb-20 overflow-x-hidden animate-pulse">
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800" />
      <div className="h-[60vh] bg-slate-900" />
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="h-6 w-48 bg-slate-800 rounded-full" />
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="w-[220px] h-[330px] bg-slate-900 rounded-3xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

