export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-brand-400 animate-spin" />
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Loading</p>
      </div>
    </div>
  );
}
