
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight, Wind, Heart, Coffee, Moon, Sun, CloudRain, Zap } from 'lucide-react';
import { GENRES, CONTENT, Content } from '../data/mockData';

// Custom moods with better icons/feel
const RELAXED_MOODS = [
    { id: 'chill', label: 'Unwind', icon: Coffee, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'happy', label: 'Uplift', icon: Sun, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'romantic', label: 'Romance', icon: Heart, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'sad', label: 'Feel', icon: CloudRain, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'excited', label: 'Thrill', icon: Zap, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'thoughtful', label: 'Think', icon: Moon, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
];

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendation: Content) => void;
}

type Step = 'mood' | 'genre' | 'time' | 'processing';

export const WhatToWatchWizard = ({ isOpen, onClose, onComplete }: WizardProps) => {
  const [step, setStep] = useState<Step>('mood');
  const [selections, setSelections] = useState({
    mood: '',
    genres: [] as string[],
    time: ''
  });
  
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('mood');
        setSelections({ mood: '', genres: [], time: '' });
      }, 500);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 'mood') setStep('genre');
    else if (step === 'genre') setStep('time');
    else if (step === 'time') {
      setStep('processing');
      setTimeout(() => {
        const match = CONTENT.find(c => 
          c.moods?.includes(selections.mood) || 
          c.genres.some(g => selections.genres.includes(g))
        ) || CONTENT[0];
        onComplete(match);
      }, 2500);
    }
  };

  const toggleGenre = (genre: string) => {
    if (selections.genres.includes(genre)) {
      setSelections(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
    } else {
      setSelections(prev => ({ ...prev, genres: [...prev.genres, genre] }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#0f1115]/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl bg-[#1e2128] border border-white/5 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col min-h-[600px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Minimal */}
        <div className="absolute top-0 right-0 p-6 z-20">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-10">
          <AnimatePresence mode="wait">
            {step === 'mood' && (
              <motion.div 
                key="mood"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="text-center mb-12">
                    <span className="text-brand-300 text-xs font-medium tracking-widest uppercase mb-3 block">Step 1 of 3</span>
                    <h2 className="text-4xl font-light text-white">What's your vibe tonight?</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {RELAXED_MOODS.map(mood => {
                    const Icon = mood.icon;
                    const isSelected = selections.mood === mood.id;
                    return (
                        <button
                        key={mood.id}
                        onClick={() => setSelections({ ...selections, mood: mood.id })}
                        className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${
                            isSelected 
                            ? `${mood.color} border-current`
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:scale-[1.02]'
                        }`}
                        >
                        <Icon className={`w-8 h-8 ${isSelected ? 'animate-bounce' : ''}`} strokeWidth={1.5} />
                        <span className="font-medium tracking-wide">{mood.label}</span>
                        {isSelected && (
                            <motion.div layoutId="check" className="absolute top-4 right-4">
                                <Check className="w-4 h-4" />
                            </motion.div>
                        )}
                        </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'genre' && (
              <motion.div 
                key="genre"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="text-center mb-12">
                    <span className="text-brand-300 text-xs font-medium tracking-widest uppercase mb-3 block">Step 2 of 3</span>
                    <h2 className="text-4xl font-light text-white">Any specific flavor?</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-6 py-3 rounded-2xl border text-sm transition-all duration-300 ${
                        selections.genres.includes(genre)
                          ? 'bg-brand-500/20 text-brand-200 border-brand-500/50'
                          : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'time' && (
              <motion.div 
                key="time"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="text-center mb-12">
                    <span className="text-brand-300 text-xs font-medium tracking-widest uppercase mb-3 block">Final Step</span>
                    <h2 className="text-4xl font-light text-white">How much time do you have?</h2>
                </div>
                <div className="space-y-4 max-w-md mx-auto w-full">
                  {[
                    { id: 'short', label: 'Quick Watch', sub: 'Under 90 mins' },
                    { id: 'movie', label: 'Feature Film', sub: 'The full experience' },
                    { id: 'long', label: 'Binge Session', sub: 'Don\'t wait up' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelections({ ...selections, time: opt.id })}
                      className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group ${
                        selections.time === opt.id
                          ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-brand-500/30 text-white'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-lg">{opt.label}</div>
                        <div className="text-sm opacity-50 font-light">{opt.sub}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-colors ${selections.time === opt.id ? 'bg-brand-500 border-brand-500' : 'group-hover:border-white/50'}`}>
                          {selections.time === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="relative w-40 h-40 mb-10"
                 >
                    <div className="absolute inset-0 rounded-full border-t border-brand-500/30 w-full h-full" />
                    <div className="absolute inset-4 rounded-full border-r border-accent-500/30 w-32 h-32" />
                    <div className="absolute inset-8 rounded-full border-b border-purple-500/30 w-24 h-24" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white/20 animate-pulse" />
                    </div>
                 </motion.div>
                 
                <h3 className="text-3xl font-light text-white mb-3 text-center">Curating your experience...</h3>
                <p className="text-white/40 text-center font-light">Analyzing mood patterns and genre flows.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          {step !== 'processing' && (
            <div className="mt-8 flex justify-end">
                <button
                onClick={handleNext}
                disabled={
                    (step === 'mood' && !selections.mood) ||
                    (step === 'time' && !selections.time)
                }
                className="flex items-center gap-3 px-8 py-4 bg-white text-[#0f1115] rounded-full font-medium hover:bg-brand-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                {step === 'time' ? 'Reveal Match' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
