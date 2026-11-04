import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse popular movies and find your next favorite film.',
  alternates: { canonical: '/movies' },
};

export default function MoviesLayout({ children }: { children: ReactNode }) {
  return children;
}
