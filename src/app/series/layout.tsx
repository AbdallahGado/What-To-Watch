import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'TV Series',
  description: 'Browse popular TV series and discover what to watch next.',
  alternates: { canonical: '/series' },
};

export default function SeriesLayout({ children }: { children: ReactNode }) {
  return children;
}
