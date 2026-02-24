import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function WhatToWatchEntry() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <Link
        href="/what-to-watch"
        className="group block relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#1e2128] transition-all duration-500 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 p-32 bg-brand-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-brand-500/30 transition-colors" />

        <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-300 text-xs font-medium tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              <span>AI Recommendation</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-6 leading-tight">
              Can&apos;t decide <br className="hidden md:block" /> what to watch?
            </h2>

            <p className="text-lg text-white/60 max-w-lg font-light leading-relaxed">
              Let our mood-matching engine curate the perfect content for your current vibe. No more endless scrolling.
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-white text-background rounded-full font-medium transition-all group-hover:scale-105 active:scale-95 shadow-xl shadow-white/5 overflow-hidden">
              <span className="relative z-10">Start Matching</span>
              <Sparkles className="w-5 h-5 relative z-10 text-brand-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

