'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { 
  Sparkles, ArrowRight, BookmarkCheck, BookmarkPlus, Check, RotateCcw, Users, User,
  Coffee, Sun, Heart, CloudRain, Zap, Brain, History, 
  Ghost, Mountain, Globe, Languages, Film, Tv, Shuffle, X, Shield, Compass,
  type LucideIcon
} from 'lucide-react';
import { useRecommendStore } from './store';
import { RecommendationItem, MoodId, MediaTypeId, TimeId, GroupId, LanguageId, AdventureId } from './types';
import { useWatchlistStore, type WatchlistItem } from '@/features/watchlist/store';
import { Navbar } from '@/app/components/Navbar';
import { MovieCard } from '@/app/components/MovieCard';
import { MOOD_CONFIGS } from '@/lib/recommendation-data';
import Link from 'next/link';

type Step = 'type' | 'mood' | 'genre' | 'time' | 'group' | 'language' | 'adventure' | 'results';

const MOOD_COLORS: Partial<Record<MoodId, string>> = {
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
    const gradient = form.mood ? MOOD_COLORS[form.mood] : undefined;
    if (gradient) {
      setBgGradient(gradient);
    }
  }, [form.mood]);

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(undefined);

      const runtimeMinutes =
        form.time === 'short' ? 90 : form.time === 'movie' ? 150 : form.time === 'long' ? 300 : undefined;

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          mood: form.mood,
          genres: form.genres,
          runtimeMinutes,
          group: form.group,
          language: form.language,
          adventure: form.adventure
        })
      });

      if (!res.ok) throw new Error('Failed to generate recommendations');

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

  const [step, setStep] = useState<Step>('type');

  useEffect(() => {
    const requestedMood = new URLSearchParams(window.location.search).get('mood');
    const mood = Object.keys(MOOD_CONFIGS).find(
      (candidate): candidate is MoodId => candidate === requestedMood
    );

    if (!mood) return;

    setForm({ type: 'any', mood });
    setStep('mood');
  }, [setForm]);

  const canContinue =
    (step === 'type' && !!form.type) ||
    (step === 'mood' && !!form.mood) ||
    (step === 'genre' && form.genres.length > 0) ||
    (step === 'time' && !!form.time) ||
    (step === 'group' && !!form.group) ||
    (step === 'language' && !!form.language) ||
    (step === 'adventure' && !!form.adventure);

  const handleNext = () => {
    if (step === 'type') setStep('mood');
    else if (step === 'mood') setStep('genre');
    else if (step === 'genre') setStep('time');
    else if (step === 'time') setStep('group');
    else if (step === 'group') setStep('language');
    else if (step === 'language') setStep('adventure');
    else if (step === 'adventure') {
      setStep('results');
      mutation.mutate();
    }
  };

  const handleBack = () => {
    if (step === 'mood') setStep('type');
    else if (step === 'genre') setStep('mood');
    else if (step === 'time') setStep('genre');
    else if (step === 'group') setStep('time');
    else if (step === 'language') setStep('group');
    else if (step === 'adventure') setStep('language');
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20 transition-colors duration-1000 font-sans">
      <Navbar activeView="mood" />
      <main id="main-content" tabIndex={-1} className="pt-32 max-w-5xl mx-auto px-6">
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

        <div className={`relative rounded-[2.5rem] border border-white/10 overflow-hidden transition-all duration-700 bg-gradient-to-br ${bgGradient} backdrop-blur-xl`}>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0,_transparent_60%)]" />

          <div className="relative p-8 md:p-12">
              {step !== 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10"
                >
                  {step === 'type' && (
                    <>
                      <StepHeader
                        step={1}
                        total={7}
                        title="First things first."
                        subtitle="Are we flirting or moving in together?"
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
                        total={7}
                        title="What's your vibe tonight?"
                        subtitle="Be honest. We won't tell your therapist."
                      />
                      <MoodGrid
                        value={form.mood}
                        onChange={(mood) => setForm({ mood })}
                      />
                    </>
                  )}

                  {step === 'genre' && (
                    <>
                      <StepHeader
                        step={3}
                        total={7}
                        title="What are you in the mood for?"
                        subtitle="Check all that apply. No judgment."
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
                        total={7}
                        title="How much time do you have?"
                        subtitle="We'll match titles that fit your attention span."
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
                        total={7}
                        title="Who's joining you?"
                        subtitle="More people = more snacks. Also more opinions."
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
                        total={7}
                        title="The Subtitle Situation"
                        subtitle="Are we reading along or just vibing?"
                      />
                      <LanguageOptions 
                        value={form.language}
                        onChange={(language) => setForm({ language })}
                      />
                    </>
                  )}

                  {step === 'adventure' && (
                    <>
                      <StepHeader
                        step={7}
                        total={7}
                        title="How risky do you want to be?"
                        subtitle="Safe bets, hidden gems, or total chaos?"
                      />
                      <AdventureOptions
                        value={form.adventure}
                        onChange={(adventure) => setForm({ adventure })}
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
                  onEditAnswers={() => setStep('mood')}
                  onStartOver={() => {
                    useRecommendStore.getState().reset();
                    setStep('type');
                  }}
                />
              )}

            {step !== 'results' && (
              <div className="mt-12 flex items-center justify-between">
                {step !== 'type' ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white/65 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                    Back
                  </button>
                ) : <span />}
                <button
                  onClick={handleNext}
                  disabled={!canContinue || isLoading}
                  className="flex items-center gap-3 px-10 py-4 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {step === 'language' || step === 'adventure' ? 'Reveal Matches' : 'Continue'}
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

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-brand-300 font-bold mb-3">
        Step {step} of {total}
      </p>
      <h2 className="text-3xl md:text-4xl font-light mb-2">{title}</h2>
      <p className="text-base text-white/50">{subtitle}</p>
    </div>
  );
}

function MediaTypeOptions({ value, onChange }: { value: MediaTypeId; onChange: (v: MediaTypeId) => void }) {
  const OPTIONS: Array<{ id: MediaTypeId; label: string; sub: string; icon: LucideIcon }> = [
    { id: 'movie', label: 'Movie', sub: 'One sitting, one story. No strings attached.', icon: Film },
    { id: 'tv', label: 'TV Series', sub: 'Characters I can grow old with. Commitment-phobes look away.', icon: Tv },
    { id: 'any', label: 'Surprise Me', sub: 'I&apos;m bad at decisions. You pick.', icon: Shuffle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`group relative p-8 rounded-3xl border text-left transition-all duration-300 ${
              selected ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/5' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors ${selected ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/40'}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold">{opt.label}</span>
              {selected && <Check className="w-5 h-5 text-brand-400" />}
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-light">{opt.sub}</p>
          </button>
        );
      })}
    </div>
  );
}

function MoodGrid({ value, onChange }: { value: MoodId | ''; onChange: (id: MoodId) => void }) {
  const MOODS: Array<{ id: MoodId; label: string; blurb: string; icon: LucideIcon }> = [
    { id: 'chill', label: 'Low Effort Mode', blurb: 'My brain is a potato. Feed it gently.', icon: Coffee },
    { id: 'happy', label: 'Main Character Energy', blurb: 'Make me believe in happy endings again.', icon: Sun },
    { id: 'romantic', label: 'Date Night Energy', blurb: 'Sweep me off my feet (or at least off the couch).', icon: Heart },
    { id: 'sad', label: 'Emotional Support Movie', blurb: 'I want to cry into my popcorn.', icon: CloudRain },
    { id: 'excited', label: 'Adrenaline Junkie', blurb: 'Car chases and plot twists, please.', icon: Zap },
    { id: 'thoughtful', label: 'Brain Gym', blurb: 'Make me question reality. On purpose.', icon: Brain },
    { id: 'nostalgic', label: 'Throwback Vibes', blurb: 'Remind me of simpler times.', icon: History },
    { id: 'dark', label: 'Noir & Twisted', blurb: 'I want to feel unsettled. In a good way.', icon: Ghost },
    { id: 'inspiring', label: 'Pick-Me-Up', blurb: 'Make me believe in humans again.', icon: Mountain }
  ];

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
            aria-pressed={selected}
            className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              selected ? 'border-brand-400 bg-brand-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
             <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-white/40'}`}>
                <Icon className="w-5 h-5" />
              </div>
              {selected && <Check className="w-4 h-4 text-brand-400" />}
            </div>
            <span className="block text-base font-bold mb-1">{mood.label}</span>
            <p className="text-xs text-white/40 leading-relaxed font-light">{mood.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}

function GenreGrid({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  const GENRES = [
    { id: 28, label: 'Action' }, { id: 35, label: 'Comedy' }, { id: 18, label: 'Drama' },
    { id: 10749, label: 'Romance' }, { id: 27, label: 'Horror' }, { id: 878, label: 'Sci-Fi' },
    { id: 16, label: 'Animation' }, { id: 53, label: 'Thriller' }, { id: 99, label: 'Documentary' },
    { id: 10751, label: 'Family' }
  ];
  
  const toggle = (id: number) => {
    if (value.includes(id)) onChange(value.filter((g) => g !== id));
    else onChange([...value, id]);
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
            aria-pressed={selected}
            className={`rounded-full border px-7 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              selected ? 'border-brand-400 bg-brand-500/20 text-brand-100 shadow-lg shadow-brand-500/10' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            {genre.label}
          </button>
        );
      })}
    </div>
  );
}

function TimeOptions({ value, onChange }: { value: TimeId; onChange: (v: TimeId) => void }) {
  const OPTIONS: Array<{ id: TimeId; label: string; sub: string }> = [
    { id: 'short', label: 'The Quickie', sub: 'Under 90 mins. In and out.' },
    { id: 'movie', label: 'Feature Presentation', sub: 'About 2 hours. Settle in.' },
    { id: 'long', label: 'Epic Saga', sub: '2.5+ hours. Bring snacks.' },
    { id: 'binge', label: 'Blackout Mode', sub: 'Whole series. I\'ll see you in a week.' }
  ];

  return (
    <div className="space-y-4">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full flex items-center justify-between rounded-3xl border px-8 py-5 text-left transition-all duration-300 ${
              selected ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/5' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div>
              <div className="text-lg font-bold mb-1">{opt.label}</div>
              <div className="text-sm text-white/40 font-light">{opt.sub}</div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-brand-500 bg-brand-500 shadow-[0_0_15px_rgba(203,143,101,0.5)]' : 'border-white/20'}`}>
              {selected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function GroupOptions({ value, onChange }: { value: GroupId; onChange: (v: GroupId) => void }) {
  const OPTIONS: Array<{ id: GroupId; label: string; sub: string; icon: LucideIcon }> = [
    { id: 'solo', label: 'Me, Myself & I', sub: 'Just me and my snacks. No sharing.', icon: User },
    { id: 'date', label: 'Impress Someone', sub: 'Something to make us both look cultured.', icon: Heart },
    { id: 'friends', label: 'The Squad', sub: 'Crowd-pleasers so nobody complains.', icon: Users },
    { id: 'family', label: 'The Whole Crew', sub: 'PG-rated so grandma doesn&apos;t walk out.', icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-5 rounded-3xl border px-8 py-6 text-left transition-all duration-300 ${
              selected ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/5' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white/10 text-white/40'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold mb-1">{opt.label}</div>
              <p className="text-sm text-white/40 leading-relaxed font-light">{opt.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function LanguageOptions({ value, onChange }: { value: LanguageId; onChange: (v: LanguageId) => void }) {
  const OPTIONS: Array<{ id: LanguageId; label: string; sub: string; icon: LucideIcon }> = [
    { id: 'any', label: 'Subtitles Welcome', sub: 'I&apos;ll read. The world is my oyster.', icon: Globe },
    { id: 'english', label: 'No Reading Required', sub: 'Just hit play. I&apos;m tired.', icon: Languages },
  ];

  return (
    <div className="space-y-5">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-6 w-full rounded-3xl border px-8 py-6 text-left transition-all duration-300 ${
              selected ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/5' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-brand-500/20 text-brand-300' : 'bg-white/10 text-white/40'}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold mb-1">{opt.label}</div>
              <p className="text-base text-white/40 leading-relaxed font-light">{opt.sub}</p>
            </div>
            {selected && <Check className="w-6 h-6 text-brand-400" />}
          </button>
        );
      })}
    </div>
  );
}

function AdventureOptions({ value, onChange }: { value: AdventureId; onChange: (v: AdventureId) => void }) {
  const OPTIONS: Array<{ id: AdventureId; label: string; sub: string; icon: LucideIcon }> = [
    { id: 'safe', label: 'Safe Bet', sub: 'Popular, reliable, no surprises.', icon: Shield },
    { id: 'balanced', label: 'Balanced', sub: 'A mix of hits and hidden gems.', icon: Compass },
    { id: 'wild', label: 'Wild Card', sub: 'Deep cuts and bold picks. Surprise me.', icon: Zap },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-4 rounded-3xl border p-6 text-center transition-all duration-300 ${
              selected ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-500/5' : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              selected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white/10 text-white/40'
            }`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold mb-1">{opt.label}</div>
              <p className="text-base text-white/40 leading-relaxed font-light">{opt.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface ResultsSectionProps {
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onEditAnswers: () => void;
  onStartOver: () => void;
}

function ResultsSection({ loading, error, onRetry, onEditAnswers, onStartOver }: ResultsSectionProps) {
  const { results } = useRecommendStore();
  const savedItems = useWatchlistStore((state) => state.items);
  const addToWatchlist = useWatchlistStore((state) => state.add);
  const removeFromWatchlist = useWatchlistStore((state) => state.remove);
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_MESSAGES = [
    'Judging your life choices...',
    'Consulting the movie gods...',
    'Filtering out the garbage...',
    'Calculating your taste score...',
    'Almost done. Hold my popcorn.',
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading, LOADING_MESSAGES.length]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-t-2 border-brand-500"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-r-2 border-accent-500 opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-light text-white/80 tracking-wide"
          >
            {LOADING_MESSAGES[loadingStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 mb-2">
            <X className="w-8 h-8" />
        </div>
        <p className="text-lg text-white/70">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-8 py-3 rounded-full bg-white text-background font-medium hover:bg-white/90 transition-all font-bold"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!results.length) return null;

  const [primary, ...rest] = results;
  const isSaved = (item: RecommendationItem) =>
    Boolean(savedItems[`${item.mediaType}:${item.id}`]);
  const toggleSaved = (item: RecommendationItem) => {
    const watchlistItem: WatchlistItem = {
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      year: item.year,
    };

    if (isSaved(item)) removeFromWatchlist(item.id, item.mediaType);
    else addToWatchlist(watchlistItem);
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-10 pt-6"
    >
      {primary && (
        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/[0.09] via-white/[0.035] to-accent-500/[0.06] p-5 md:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative grid gap-7 md:grid-cols-[220px_minmax(0,1fr)] md:gap-9">
            <Link
              href={`/${primary.mediaType}/${primary.id}`}
              aria-label={`View details for ${primary.title}`}
              className="mx-auto block w-full max-w-[220px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            >
              <MovieCard
                tmdb={{
                  id: primary.id,
                  title: primary.title,
                  poster_path: primary.posterPath,
                  vote_average: primary.voteAverage,
                  year: primary.year,
                }}
                variant="portrait"
                priority
              />
            </Link>

            <div className="flex min-w-0 flex-col justify-center gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Your top match
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/55">
                  {primary.mediaType === 'tv' ? 'Series' : 'Movie'}
                  {primary.year ? ` · ${primary.year}` : ''}
                </span>
              </div>

              <div>
                <h2 className="font-display text-3xl leading-tight text-white md:text-5xl">
                  {primary.title}
                </h2>
                {primary.voteAverage > 0 && (
                  <p className="mt-2 text-sm text-white/50">
                    TMDB rating{' '}
                    <span className="font-semibold text-amber-200">
                      {primary.voteAverage.toFixed(1)}
                    </span>{' '}
                    / 10
                  </p>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                {primary.explanation.reason}
              </p>

              <div className="flex flex-wrap gap-2" aria-label="Why this title matches">
                {primary.explanation.factors.map((factor) => (
                  <span
                    key={factor}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/65"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
                    {factor}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/${primary.mediaType}/${primary.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-background transition-all hover:scale-[1.02] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  View details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleSaved(primary)}
                  aria-pressed={isSaved(primary)}
                  aria-label={
                    isSaved(primary)
                      ? `Remove ${primary.title} from watchlist`
                      : `Save ${primary.title} to watchlist`
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  {isSaved(primary) ? (
                    <BookmarkCheck className="h-4 w-4 text-brand-300" aria-hidden="true" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isSaved(primary) ? 'Saved' : 'Add to watchlist'}
                </button>
              </div>
            </div>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <section className="space-y-5" aria-labelledby="more-match-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                Keep exploring
              </p>
              <h3 id="more-match-title" className="text-xl font-semibold text-white">
                More winners for your night
              </h3>
            </div>
            <span className="text-xs text-white/35">{rest.length} more</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((item) => (
              <article
                key={`${item.mediaType}:${item.id}`}
                className="flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-3 transition-colors hover:border-white/20"
              >
                <Link
                  href={`/${item.mediaType}/${item.id}`}
                  className="group mx-auto block w-full max-w-[220px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <MovieCard
                    tmdb={{
                      id: item.id,
                      title: item.title,
                      poster_path: item.posterPath,
                      vote_average: item.voteAverage,
                      year: item.year,
                    }}
                    variant="portrait"
                  />
                </Link>
                <p className="mt-3 min-h-[2.75rem] line-clamp-2 text-xs leading-relaxed text-white/50">
                  {item.explanation.reason}
                </p>
                <button
                  type="button"
                  onClick={() => toggleSaved(item)}
                  aria-pressed={isSaved(item)}
                  aria-label={
                    isSaved(item)
                      ? `Remove ${item.title} from watchlist`
                      : `Save ${item.title} to watchlist`
                  }
                  className="mt-auto inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  {isSaved(item) ? (
                    <BookmarkCheck className="h-4 w-4 text-brand-300" aria-hidden="true" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isSaved(item) ? 'Saved' : 'Save for later'}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={onEditAnswers}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Adjust my answers
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
      </div>
    </motion.div>
  );
}
