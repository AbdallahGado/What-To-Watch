'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { 
  Sparkles, ArrowRight, Check, Users, User, 
  Coffee, Sun, Heart, CloudRain, Zap, Brain, History, 
  Ghost, Mountain, Globe, Languages, Film, Tv, Shuffle, X,
  type LucideIcon
} from 'lucide-react';
import { useRecommendStore } from './store';
import { RecommendationItem, MoodId, MediaTypeId, TimeId, GroupId, LanguageId } from './types';
import { Navbar } from '@/app/components/Navbar';
import { MovieCard } from '@/app/components/MovieCard';
import { MOOD_CONFIGS } from '@/lib/recommendation-data';
import Link from 'next/link';

type Step = 'type' | 'mood' | 'genre' | 'time' | 'group' | 'language' | 'results';

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
          language: form.language
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
    <div className="min-h-screen bg-background text-white pb-20 transition-colors duration-1000 font-sans">
      <Navbar activeView="mood" />
      <main className="pt-32 max-w-5xl mx-auto px-6">
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
            <AnimatePresence mode="wait">
              {step !== 'results' && (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10"
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
                        onChange={(mood) => setForm({ mood })}
                      />
                    </>
                  )}

                  {step === 'genre' && (
                    <>
                      <StepHeader
                        step={3}
                        total={6}
                        title="What are you in the mood for?"
                        subtitle="Pick a few genres you're open to."
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
                        subtitle="We'll match titles that fit your session."
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
              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!canContinue || isLoading}
                  className="flex items-center gap-3 px-10 py-4 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
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
    { id: 'movie', label: 'Movie', sub: 'A complete story in one sitting.', icon: Film },
    { id: 'tv', label: 'TV Series', sub: 'Characters I can grow old with.', icon: Tv },
    { id: 'any', label: 'Surprise Me', sub: 'Just give me something good.', icon: Shuffle },
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
    { id: 'chill', label: 'Chill & Relax', blurb: 'Easy watching, no stress.', icon: Coffee },
    { id: 'happy', label: 'Feel Good', blurb: 'Uplifting and joyful vibes.', icon: Sun },
    { id: 'romantic', label: 'Romantic', blurb: 'Fall in love again.', icon: Heart },
    { id: 'sad', label: 'Emotional', blurb: 'Need a good cry tonight.', icon: CloudRain },
    { id: 'excited', label: 'Thrilling', blurb: 'Fast-paced action.', icon: Zap },
    { id: 'thoughtful', label: 'Mind-bending', blurb: 'Deep and complex stories.', icon: Brain },
    { id: 'nostalgic', label: 'Classics', blurb: 'Relive the golden era.', icon: History },
    { id: 'dark', label: 'Dark / Gritty', blurb: 'Twisted and atmospheric.', icon: Ghost },
    { id: 'inspiring', label: 'Inspirational', blurb: 'True stories that motivate.', icon: Mountain }
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
            className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 ${
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
            className={`px-7 py-3 rounded-full border text-sm font-medium transition-all duration-300 ${
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
    { id: 'short', label: 'The Quick Watch', sub: 'Under 90 minutes. Perfect for a busy night.' },
    { id: 'movie', label: 'The Main Event', sub: 'Standard movie length. Around 2 hours.' },
    { id: 'long', label: 'The Deep Dive', sub: '2.5+ hours. For those rainy weekends.' },
    { id: 'binge', label: 'Binge-worthy', sub: 'Looking for a whole series to lose myself in.' }
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
    { id: 'solo', label: 'Solo Session', sub: 'My own secret cinematic sanctuary.', icon: User },
    { id: 'date', label: 'Date Night', sub: 'Impressive, engaging, and romantic.', icon: Heart },
    { id: 'friends', label: 'With Friends', sub: 'Crowd-pleasers and conversation starters.', icon: Users },
    { id: 'family', label: 'Family Time', sub: 'Safe, fun, and wholesome for everyone.', icon: Users },
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
    { id: 'any', label: 'Open to Anything', sub: 'Subtitles are the window to the world.', icon: Globe },
    { id: 'english', label: 'English Only', sub: 'Keeping it simple and focused.', icon: Languages },
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

interface ResultsSectionProps {
  loading: boolean;
  error?: string;
  onRetry: () => void;
}

function ResultsSection({ loading, error, onRetry }: ResultsSectionProps) {
  const { results } = useRecommendStore();
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_MESSAGES = [
    'Scanning 10,000+ titles...',
    'Analyzing your current vibe...',
    'Filtering for the perfect runtime...',
    'Checking critical acclaim...',
    'Finalizing your matches...'
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

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

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="space-y-16 pt-6"
    >
      {primary && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative flex flex-col md:flex-row gap-10 items-center bg-[#1e2128]/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 border border-white/10">
            <div className="w-full md:w-[300px] shrink-0 transform transition-transform duration-700 group-hover:scale-[1.03]">
                <Link href={`/${primary.mediaType}/${primary.id}`}>
                    <MovieCard
                        tmdb={{
                            id: primary.id,
                            title: primary.title,
                            poster_path: primary.posterPath,
                            vote_average: primary.voteAverage,
                            year: primary.year
                        }}
                        variant="portrait"
                        priority
                    />
                </Link>
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-[0.25em]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ultimate Match
                </div>
                <div className="text-3xl font-light text-brand-200">
                    98% <span className="text-sm opacity-50 uppercase tracking-[0.3em]">Similarity</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight">
                {primary.title}
              </h2>
              
              <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed line-clamp-4">
                {primary.overview}
              </p>
              
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {primary.explanation.factors.map((f, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={f} 
                    className="flex items-center gap-3 text-sm text-white/40"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500/60 shadow-[0_0_8px_rgba(203,143,101,0.5)]" />
                    {f}
                  </motion.div>
                ))}
              </div>

              <div className="pt-8">
                 <Link 
                    href={`/${primary.mediaType}/${primary.id}`}
                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-background rounded-full font-bold hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-white/5"
                 >
                    Start Watching
                    <ArrowRight className="w-5 h-5" />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <h3 className="text-xs uppercase tracking-[0.4em] text-white/25 font-bold shrink-0">
                More Exceptional Choices
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {rest.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                key={item.id}
              >
                <Link href={`/${item.mediaType}/${item.id}`} className="group block">
                    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]">
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
                    </div>
                    <div className="mt-5 flex items-center justify-between px-2">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{item.year}</span>
                        <div className="h-[1px] w-8 bg-white/10" />
                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">~92% Match</span>
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-16 flex justify-center border-t border-white/5 mx-20">
         <button 
            onClick={() => window.location.reload()}
            className="text-white/20 hover:text-white transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] group"
         >
            <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Find Something Else
         </button>
      </div>
    </motion.div>
  );
}
