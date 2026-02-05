'use client';

import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

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

export function Providers({ children }: { children: ReactNode }) {
  // Memoize QueryClient to prevent recreation on every render
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

