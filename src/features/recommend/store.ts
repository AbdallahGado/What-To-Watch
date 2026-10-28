'use client';

import { create } from 'zustand';
import { RecommendationFormState, RecommendationItem } from './types';

interface RecommendState {
  form: RecommendationFormState;
  results: RecommendationItem[];
  isLoading: boolean;
  error?: string;
  setForm: (partial: Partial<RecommendationFormState>) => void;
  setResults: (items: RecommendationItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialForm: RecommendationFormState = {
  type: '',
  mood: '',
  genres: [],
  time: '',
  group: '',
  language: '',
  adventure: ''
};

export const useRecommendStore = create<RecommendState>((set) => ({
  form: initialForm,
  results: [],
  isLoading: false,
  error: undefined,
  setForm: (partial) =>
    set((state) => ({ form: { ...state.form, ...partial } })),
  setResults: (items) => set({ results: items }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ form: initialForm, results: [], error: undefined })
}));

