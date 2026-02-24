export function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-6 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-full mb-8" />
      <div className="flex gap-10 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px] px-2 h-[360px] bg-white/5 rounded-[26px]" />
        ))}
      </div>
    </div>
  );
}
