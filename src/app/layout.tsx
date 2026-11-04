import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { Providers } from '@/components/providers';
import { getSiteUrl } from '@/lib/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: 'What To Watch — Smart Movie & TV Recommendations',
    template: '%s · What To Watch',
  },
  description:
    'Discover trending movies, series, and personalized recommendations based on your mood, genres, and time with What To Watch.',
  metadataBase: siteUrl,
  applicationName: 'What To Watch',
  openGraph: {
    title: 'What To Watch',
    description:
      'A smart movie and TV discovery platform with personalized recommendations.',
    type: 'website',
    siteName: 'What To Watch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What To Watch',
    description: 'Smart movie and TV discovery with mood-based recommendations.',
  },
};

export default function RootLayout({  children }: { children: ReactNode }) {
  const websiteStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'What To Watch',
    url: siteUrl.toString(),
    description:
      'Discover trending movies, series, and personalized recommendations based on your mood, genres, and time.',
  }).replace(/</g, '\\u003c');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteStructuredData }}
        />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
