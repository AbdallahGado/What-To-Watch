'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { 
  Sparkles, ArrowRight, Check, Users, User, 
  Coffee, Sun, Heart, CloudRain, Zap, Brain, History, 
  Ghost, Mountain, Globe, Languages, Film, Tv, Shuffle
} from 'lucide-react';
import { useRecommendStore } from './store';
import { RecommendationItem, MoodId } from './types';
import { Navbar } from '@/app/components/Navbar';
import { MovieCard } from '@/app/components/MovieCard';
import Link from 'next/link';

// ... existing imports ...

type Step = 'type' | 'mood' | 'genre' | 'time' | 'group' | 'language' | 'results';

// Map moods to colors for dynamic background
const MOOD_COLORS: Record<string, string> = {
  chill: 'from-blue-900/40 to-teal-900/40',
  happy: 'from-yellow-600/30 to-orange-600/30',
  romantic: 'from-pink-900/40 to-rose-900/40',
  sad: 'from-slate-800/60 to-gray-900/60',
  excited: 'from-purple-900/40 to-fuchsia-900/40',
  thoughtful: 'from-indigo-900/40 to-violet-900/40',
  nostalgic: 'from-amber-900/40 to-orange-900/40',
  dark: 'from-stone-900/80 to-red-950/40',
  inspiring: 'from-sky-900/40 to-cyan-900/40',
};

export function WhatToWatchClient() {
  const { form, setForm, setResults, isLoading, setLoading, error, setError } =
    useRecommendStore();
    
  const [bgGradient, setBgGradient] = useState('from-[#1e2128]/80 to-[#1e2128]/80');

  useEffect(() => {
    if (form.mood && MOOD_COLORS[form.mood]) {
      setBgGradient(MOOD_COLORS[form.mood]);
    }
  }, [form.mood]);

  // ... useEffect for BG ...

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(undefined);

      // Map time options to minutes
      const runtimeMinutes =
        form.time === 'short'
          ? 90
          : form.time === 'movie'
            ? 150
            : form.time === 'long'
              ? 300
              : undefined;

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          mood: form.mood,
          genres: form.genres,
          runtimeMinutes,
          group: form.group,
          language: form.language
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = (await res.json()) as RecommendationItem[];
      setResults(data);
      setLoading(false);
      return data;
    },
    onError: () => {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  });

  const [step, setStep] = React.useState<Step>('type');

  const canContinue =
    (step === 'type' && !!form.type) ||
    (step === 'mood' && !!form.mood) ||
    (step === 'genre' && form.genres.length > 0) ||
    (step === 'time' && !!form.time) ||
    (step === 'group' && !!form.group) ||
    (step === 'language' && !!form.language);

  const handleNext = () => {
    if (step === 'type') setStep('mood');
    else if (step === 'mood') setStep('genre');
    else if (step === 'genre') setStep('time');
    else if (step === 'time') setStep('group');
    else if (step === 'group') setStep('language');
    else if (step === 'language') {
      setStep('results');
      mutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20 transition-colors duration-1000">
      <Navbar activeView="what-to-watch" />
      <main className="pt-32 max-w-5xl mx-auto px-6">
        {/* ... Header ... */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-300 font-semibold">
              What To Watch
            </p>
            <h1 className="text-3xl md:text-4xl font-light">
              Let&apos;s find tonight&apos;s perfect watch.
            </h1>
          </div>
        </div>

        {/* Dynamic Background Container */}
        <div className={`relative rounded-3xl border border-white/10 overflow-hidden transition-all duration-700 bg-gradient-to-br ${bgGradient} backdrop-blur-xl`}>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0,_transparent_60%)]" />

          <div className="relative p-8 md:p-10">
            <AnimatePresence mode="wait">
              {step !== 'results' && (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-8"
                >
                  {step === 'type' && (
                    <>
                      <StepHeader
                        step={1}
                        total={6}
                        title="First things first."
                        subtitle="What kind of commitment are we talking about?"
                      />
                      <MediaTypeOptions
                        value={form.type}
                        onChange={(type) => setForm({ type })}
                      />
                    </>
                  )}

                  {step === 'mood' && (
                    <>
                      <StepHeader
                        step={2}
                        total={6}
                        title="What's your vibe tonight?"
                        subtitle="Choose the mood that best fits how you feel right now."
                      />
                      <MoodGrid
                        value={form.mood}
                        onChange={(mood) => setForm({ mood: mood as any })}
                      />
                    </>
                  )}

                  {step === 'genre' && (
                    <>
                      <StepHeader
                        step={3}
                        total={6}
                        title="What are you in the mood for?"
                        subtitle="Pick a few genres you’re open to."
                      />
                      <GenreGrid
                        value={form.genres}
                        onChange={(genres) => setForm({ genres })}
                      />
                    </>
                  )}

                  {step === 'time' && (
                    <>
                      <StepHeader
                        step={4}
                        total={6}
                        title="How much time do you have?"
                        subtitle="We’ll match titles that fit your session."
                      />
                      <TimeOptions
                        value={form.time}
                        onChange={(time) => setForm({ time })}
                      />
                    </>
                  )}

                  {step === 'group' && (
                    <>
                      <StepHeader
                        step={5}
                        total={6}
                        title="Watching solo or with others?"
                        subtitle="Helps us balance crowd‑pleasers vs. immersive picks."
                      />
                      <GroupOptions
                        value={form.group}
                        onChange={(group) => setForm({ group })}
                      />
                    </>
                  )}

                  {step === 'language' && (
                    <>
                       <StepHeader
                        step={6}
                        total={6}
                        title="The Subtitle Situation"
                        subtitle="Are we expanding horizons or keeping it simple?"
                      />
                      <LanguageOptions 
                        value={form.language}
                        onChange={(language) => setForm({ language })}
                      />
                    </>
                  )}
                </motion.div>
              )}

              {step === 'results' && (
                <ResultsSection
                  loading={isLoading}
                  error={error}
                  onRetry={mutation.mutate}
                />
              )}
            </AnimatePresence>

            {step !== 'results' && (
              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canContinue || isLoading}
                  className="flex items-center gap-3 px-8 py-3 rounded-full bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {step === 'language' ? 'Reveal Matches' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
// ...
interface MediaTypeOptionsProps {
    value: string;
    onChange: (value: any) => void;
}

function MediaTypeOptions({ value, onChange }: MediaTypeOptionsProps) {
    const OPTIONS = [
        { id: 'movie', label: 'Movie', sub: 'A complete story in one sitting.', icon: Film },
        { id: 'tv', label: 'TV Series', sub: 'Characters I can grow old with.', icon: Tv },
        { id: 'any', label: 'Surprise Me', sub: 'I am easy. Just give me something good.', icon: Shuffle },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OPTIONS.map((opt) => {
                const selected = value === opt.id;
                const Icon = opt.icon;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className={`group relative p-6 rounded-2xl border text-left transition-all ${
                        selected
                            ? 'border-brand-400 bg-brand-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/40'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${selected ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/60'}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold">{opt.label}</span>
                             {selected && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500">
                                <Check className="w-3 h-3" />
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            {opt.sub}
                        </p>
                    </button>
                )
            })}
        </div>
    );
}


// ... StepHeader stays ...

interface StepHeaderProps {
    step: number;
    total: number;
    title: string;
    subtitle: string;
}

function StepHeader({ step, total, title, subtitle }: StepHeaderProps) {
    return (
        <div>
        <p className="text-xs uppercase tracking-[0.25em] text-brand-300 font-semibold mb-2">
            Step {step} of {total}
        </p>
        <h2 className="text-2xl md:text-3xl font-light mb-1">{title}</h2>
        <p className="text-sm text-white/60">{subtitle}</p>
        </div>
    );
}

const MOODS = [
  { id: 'chill', label: 'Brain is Mush', blurb: 'I want to stare at a screen and drool. No thinking allowed.', icon: Coffee },
  { id: 'happy', label: 'Dopamine Hit', blurb: 'Restore my faith in humanity. Good vibes only.', icon: Sun },
  { id: 'romantic', label: 'In My Feels', blurb: 'Yearning, burning, or happily ever after. Make me swoon.', icon: Heart },
  { id: 'sad', label: 'Hurt Me', blurb: 'I need a good cry. Destroy my emotions, please.', icon: CloudRain },
  { id: 'excited', label: 'Adrenaline Junkie', blurb: 'Explosions, fast cars, and zero chill. Wake me up.', icon: Zap },
  { id: 'thoughtful', label: 'Existential Crisis', blurb: 'Make me question my reality. Deep thoughts only.', icon: Brain },
  { id: 'nostalgic', label: 'Comfort Food', blurb: 'Take me back to a simpler time. Classics only.', icon: History },
  { id: 'dark', label: 'Into the Abyss', blurb: 'Twisted, psychological, and dark. Mess me up.', icon: Ghost },
  { id: 'inspiring', label: 'Maximize Me', blurb: 'Documentaries and true stories. I want to learn something.', icon: Mountain }
] as const;

interface MoodGridProps {
  value: string;
  onChange: (id: string) => void;
}

function MoodGrid({ value, onChange }: MoodGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {MOODS.map((mood) => {
        const selected = value === mood.id;
        const Icon = mood.icon;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onChange(mood.id)}
            className={`group relative p-4 rounded-2xl border text-left transition-all ${
              selected
                ? 'border-brand-400 bg-brand-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold flex items-center gap-2">
                <Icon className={`w-4 h-4 ${selected ? 'text-brand-300' : 'text-white/40'}`} />
                {mood.label}
              </span>
              {selected && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 leading-relaxed">{mood.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}

// ... GENRES and GenreGrid stay ...

const GENRES = [
    { id: 28, label: 'Action' },
    { id: 35, label: 'Comedy' },
    { id: 18, label: 'Drama' },
    { id: 10749, label: 'Romance' },
    { id: 27, label: 'Horror' },
    { id: 878, label: 'Sci‑Fi' },
    { id: 16, label: 'Animation' },
    { id: 53, label: 'Thriller' },
    { id: 99, label: 'Documentary' },
    { id: 10751, label: 'Family' }
  ];
  
  interface GenreGridProps {
    value: number[];
    onChange: (genres: number[]) => void;
  }
  
  function GenreGrid({ value, onChange }: GenreGridProps) {
    const toggle = (id: number) => {
      if (value.includes(id)) {
        onChange(value.filter((g) => g !== id));
      } else {
        onChange([...value, id]);
      }
    };
  
    return (
      <div className="flex flex-wrap gap-3">
        {GENRES.map((genre) => {
          const selected = value.includes(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggle(genre.id)}
              className={`px-5 py-2 rounded-full border text-sm transition-all ${
                selected
                  ? 'border-brand-400 bg-brand-500/10 text-brand-100'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/40'
              }`}
            >
              {genre.label}
            </button>
          );
        })}
      </div>
    );
  }

// ... TimeOptions & GroupOptions stay ...

interface TimeOptionsProps {
    value: string;
    onChange: (value: any) => void;
}
  
function TimeOptions({ value, onChange }: TimeOptionsProps) {
    const OPTIONS = [
        { id: 'short', label: 'The "Quickie"', sub: 'In and out. Under 90 mins. I have work tomorrow.' },
        { id: 'movie', label: 'The Goldilocks Zone', sub: 'Standard movie length. Around 2 hours. Just right.' },
        { id: 'long', label: 'I Live Here Now', sub: 'Epic trilogies, extended cuts. My bladder is strong.' },
        { id: 'binge', label: 'Series Binge', sub: 'Just "one more episode"... until 4 AM.' }
    ];

    return (
        <div className="space-y-3">
        {OPTIONS.map((opt) => {
            const selected = value === opt.id;
            return (
            <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`w-full flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${
                selected
                    ? 'border-brand-400 bg-brand-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/40'
                }`}
            >
                <div>
                <div className="text-sm font-bold">{opt.label}</div>
                <div className="text-xs text-white/60 mt-0.5">{opt.sub}</div>
                </div>
                <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'border-brand-400 bg-brand-500' : 'border-white/20'
                }`}
                >
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
            </button>
            );
        })}
        </div>
    );
}

interface GroupOptionsProps {
    value: string;
    onChange: (value: any) => void;
}
  
function GroupOptions({ value, onChange }: GroupOptionsProps) {
    const OPTIONS = [
        { id: 'solo', label: 'Riding Solo', sub: 'Judge-free zone. Sweatpants engaged. Play whatever I want.', icon: User },
        { id: 'date', label: 'Date Night', sub: 'Impressive but safe. Romance or thrillers. No awkward scenes.', icon: Users },
        { id: 'friends', label: 'With the Crew', sub: 'Crowd-pleasers. Horror, comedy, or action. Needs to be roastable.', icon: Users },
        { id: 'family', label: 'Family Safe', sub: 'Kids are watching. Zero trauma, maximum wholesome.', icon: Users },
    ];

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
            const selected = value === opt.id;
            const Icon = opt.icon;
            return (
                <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange(opt.id)}
                    className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
                    selected
                        ? 'border-brand-400 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/40'
                    }`}
                >
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                    </div>
                    <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <p className="text-xs text-white/60 leading-relaxed mt-1">
                        {opt.sub}
                    </p>
                    </div>
                </button>
            )
        })}
    </div>
    );
}

interface LanguageOptionsProps {
  value: string;
  onChange: (value: any) => void;
}

function LanguageOptions({ value, onChange }: LanguageOptionsProps) {
    const OPTIONS = [
        { id: 'any', label: 'I Can Read (Subtitles Okay)', sub: 'Bring on the foreign masterpieces. I am cultured.', icon: Globe },
        { id: 'english', label: 'My Eyes Are Tired (English Only)', sub: 'I am eating, scrolling on my phone, or just lazy.', icon: Languages },
    ];

  return (
    <div className="space-y-4">
      {OPTIONS.map((opt) => {
            const selected = value === opt.id;
            const Icon = opt.icon;
            return (
                <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange(opt.id)}
                    className={`flex items-center gap-4 w-full rounded-2xl border px-6 py-5 text-left transition-all ${
                    selected
                        ? 'border-brand-400 bg-brand-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/40'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${selected ? 'bg-brand-500/20 text-brand-300' : 'bg-white/10 text-white/60'}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-base font-bold">{opt.label}</div>
                        <p className="text-sm text-white/60 leading-relaxed mt-1">
                            {opt.sub}
                        </p>
                    </div>
                    {selected && (
                        <div className="ml-auto">
                            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                    )}
                </button>
            )
        })}
    </div>
  );
}

// ... ResultsSection follows ...


interface ResultsSectionProps {
  loading: boolean;
  error?: string;
  onRetry: () => void;
}

function ResultsSection({ loading, error, onRetry }: ResultsSectionProps) {
  const { results } = useRecommendStore();

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-white/10 border-t-brand-400 rounded-full animate-spin" />
        <p className="text-sm text-white/70">
          Matching your mood, genres, and time window…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-red-300">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="py-12 text-center text-sm text-white/60">
        Answer a few questions to see picks tailored to tonight.
      </div>
    );
  }

  const [primary, ...rest] = results;

  return (
    <div className="space-y-10 pt-4">
      {primary && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-[260px]">
            <Link href={`/movie/${primary.id}`}>
              <MovieCard
                tmdb={{
                  id: primary.id,
                  title: primary.title,
                  poster_path: primary.posterPath,
                  vote_average: primary.voteAverage,
                  year: primary.year
                }}
                variant="portrait"
              />
            </Link>
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300 font-semibold">
              Top Match
            </p>
            <h2 className="text-2xl font-light">{primary.title}</h2>
            <p className="text-sm text-white/70">{primary.overview}</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-white/60">
                Why this was suggested:
              </p>
              <ul className="space-y-1 text-xs text-white/70 list-disc list-inside">
                {primary.explanation.factors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3">
            More options for tonight
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rest.map((item) => (
              <Link key={item.id} href={`/movie/${item.id}`}>
                <MovieCard
                  tmdb={{
                    id: item.id,
                    title: item.title,
                    poster_path: item.posterPath,
                    vote_average: item.voteAverage,
                    year: item.year
                  }}
                  variant="portrait"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

