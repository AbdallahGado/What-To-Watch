'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addToWatchlist as addToWatchlistServer,
  removeFromWatchlist as removeFromWatchlistServer,
  syncWatchlistItems,
} from '@/app/actions/user';

type MediaKind = 'movie' | 'tv';

export interface WatchlistItem {
  id: number;
  mediaType: MediaKind;
  title: string;
  posterPath: string | null;
  year?: string;
}

interface WatchlistState {
  items: Record<string, WatchlistItem>;
  syncEnabled: boolean;
  setSyncEnabled: (enabled: boolean) => void;
  add: (item: WatchlistItem) => void;
  remove: (id: number, mediaType: MediaKind) => void;
  toggle: (item: WatchlistItem) => void;
  isSaved: (id: number, mediaType: MediaKind) => boolean;
  clear: () => void;
  hydrateFromServer: (items: WatchlistItem[]) => void;
  pushLocalToServer: () => Promise<void>;
}

const keyFor = (id: number, mediaType: MediaKind) => `${mediaType}:${id}`;

function toServerPayload(item: WatchlistItem) {
  return {
    tmdbId: item.id,
    title: item.title,
    mediaType: item.mediaType,
    poster: item.posterPath,
  };
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: {},
      syncEnabled: false,
      setSyncEnabled: (enabled) => set({ syncEnabled: enabled }),
      add: (item) => {
        set((state) => ({
          items: { ...state.items, [keyFor(item.id, item.mediaType)]: item },
        }));
        if (get().syncEnabled) {
          void addToWatchlistServer(toServerPayload(item)).catch((error) => {
            console.error('Failed to sync watchlist add', error);
          });
        }
      },
      remove: (id, mediaType) => {
        set((state) => {
          const key = keyFor(id, mediaType);
          const { [key]: _removed, ...rest } = state.items;
          return { items: rest };
        });
        if (get().syncEnabled) {
          void removeFromWatchlistServer(id, mediaType).catch((error) => {
            console.error('Failed to sync watchlist remove', error);
          });
        }
      },
      toggle: (item) => {
        const key = keyFor(item.id, item.mediaType);
        const exists = get().items[key];
        if (exists) {
          get().remove(item.id, item.mediaType);
        } else {
          get().add(item);
        }
      },
      isSaved: (id, mediaType) => Boolean(get().items[keyFor(id, mediaType)]),
      clear: () => set({ items: {} }),
      hydrateFromServer: (remoteItems) => {
        const merged: Record<string, WatchlistItem> = { ...get().items };
        for (const item of remoteItems) {
          merged[keyFor(item.id, item.mediaType)] = item;
        }
        set({ items: merged });
      },
      pushLocalToServer: async () => {
        if (!get().syncEnabled) return;
        const items = Object.values(get().items);
        if (items.length === 0) return;
        await syncWatchlistItems(items.map(toServerPayload));
      },
    }),
    {
      name: 'watchlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
