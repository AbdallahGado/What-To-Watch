import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'What To Watch - Smart Movie & TV Recommendations',
  description:
    'Discover trending movies, series, and personalized recommendations based on your mood, genres, and time with What To Watch.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'What To Watch',
    description:
      'A smart movie and TV discovery platform with personalized recommendations.',
    type: 'website'
  }
};

export default function RootLayout({  children }: { children: ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${playfair.variable}`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
  );
}



