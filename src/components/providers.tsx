'use client';

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { clerkAppearance, clerkEnabled } from '@/lib/clerk-appearance';
import { useWatchlistStore } from '@/features/watchlist/store';
import { fetchServerWatchlist } from '@/app/actions/user';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
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

function WatchlistAuthSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const previousSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const store = useWatchlistStore.getState();

    if (isSignedIn) {
      store.setSyncEnabled(true);
      void (async () => {
        try {
          const remote = await fetchServerWatchlist();
          store.hydrateFromServer(remote);
          await store.pushLocalToServer();
        } catch (error) {
          console.error('Watchlist sync failed', error);
        }
      })();
    } else if (previousSignedIn.current === true) {
      store.setSyncEnabled(false);
      store.clear();
      useWatchlistStore.persist?.clearStorage?.();
    } else {
      store.setSyncEnabled(false);
    }

    previousSignedIn.current = Boolean(isSignedIn);
  }, [isLoaded, isSignedIn]);

  return null;
}

function AppShell({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-center" theme="dark" richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkEnabled || !clerkKey) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <ClerkProvider publishableKey={clerkKey} appearance={clerkAppearance}>
      <WatchlistAuthSync />
      <AppShell>{children}</AppShell>
    </ClerkProvider>
  );
}
