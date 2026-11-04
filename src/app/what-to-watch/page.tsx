import type { Metadata } from 'next';
import { WhatToWatchClient } from '@/features/recommend/what-to-watch-client';

export const metadata: Metadata = {
  title: 'Mood Match',
  description:
    'Answer a few quick questions about your mood, favorite genres, and time and get a ranked list of movies and shows tailored for right now.',
  alternates: { canonical: '/what-to-watch' },
};

export default function WhatToWatchPage() {
  return <WhatToWatchClient />;
}
