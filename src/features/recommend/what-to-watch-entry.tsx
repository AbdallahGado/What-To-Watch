import Link from 'next/link';
import {
  ArrowUpRight,
  Coffee,
  Heart,
  Smile,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { MoodId } from './types';

const MOOD_SHORTCUTS: {
  mood: MoodId;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    mood: 'chill',
    label: 'Take it easy',
    description: 'Comfort watches for a slower night.',
    icon: Coffee,
    color: 'from-sky-500/20 to-teal-500/5',
  },
  {
    mood: 'happy',
    label: 'Make me smile',
    description: 'Feel-good stories and bright energy.',
    icon: Smile,
    color: 'from-amber-500/20 to-orange-500/5',
  },
  {
    mood: 'romantic',
    label: 'Something romantic',
    description: 'A little chemistry goes a long way.',
    icon: Heart,
    color: 'from-rose-500/20 to-pink-500/5',
  },
  {
    mood: 'excited',
    label: 'Bring the thrills',
    description: 'Big adventures and edge-of-seat picks.',
    icon: Zap,
    color: 'from-violet-500/25 to-fuchsia-500/5',
  },
];

export function WhatToWatchEntry() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 md:py-14" aria-labelledby="mood-shortcuts-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            A better way to browse
          </div>
          <h2 id="mood-shortcuts-title" className="font-display text-3xl md:text-4xl text-white">
            What sounds good tonight?
          </h2>
        </div>
        <Link
          href="/what-to-watch"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 rounded-md"
        >
          Build my match
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {MOOD_SHORTCUTS.map(({ mood, label, description, icon: Icon, color }) => (
          <Link
            key={mood}
            href={`/what-to-watch?mood=${mood}`}
            className={`group relative min-h-36 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${color} p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300`}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 blur-2xl transition-colors group-hover:bg-white/10" />
            <div className="relative flex h-full flex-col justify-between gap-5">
              <Icon className="h-5 w-5 text-white/75" aria-hidden="true" />
              <div>
                <div className="font-semibold text-white">{label}</div>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
