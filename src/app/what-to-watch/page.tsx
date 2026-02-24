import type { Metadata } from 'next';
import { WhatToWatchClient } from '@/features/recommend/what-to-watch-client';

export const metadata: Metadata = {
  title: 'What To Watch - Smart Mood-Based Recommendations',
  description:
    'Answer a few quick questions about your mood, favorite genres, and time and get a ranked list of movies tailored for right now.'
};

export default function WhatToWatchPage() {
  return <WhatToWatchClient />;
}
