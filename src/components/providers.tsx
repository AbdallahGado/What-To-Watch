'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { clerkAppearance, clerkEnabled } from '@/lib/clerk-appearance';
import { useWatchlistStore } from '@/features/watchlist/store';

// Optimized QueryClient configuration for better caching and performance
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevents refetch on component remount for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache data for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry failed requests once
        retry: 1,
        // Reduce network requests with aggressive stale-while-revalidate
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

function WatchlistSignOutReset() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      const store = useWatchlistStore.getState();
      if (Object.keys(store.items).length > 0) {
        store.clear();
      }
      useWatchlistStore.persist?.clearStorage?.();
    }
  }, [isLoaded, isSignedIn]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  // Memoize QueryClient to prevent recreation on every render
  const queryClient = useMemo(() => createQueryClient(), []);

  const app = (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-center" theme="dark" richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkEnabled || !clerkKey) {
    return app;
  }

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={clerkAppearance}
    >
      <WatchlistSignOutReset />
      {app}
    </ClerkProvider>
  );
}

