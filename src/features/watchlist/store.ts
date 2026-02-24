'use client';

import { create } from 'zustand';

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
  add: (item: WatchlistItem) => void;
  remove: (id: number, mediaType: MediaKind) => void;
  toggle: (item: WatchlistItem) => void;
  isSaved: (id: number, mediaType: MediaKind) => boolean;
  clear: () => void;
}

const keyFor = (id: number, mediaType: MediaKind) => `${mediaType}:${id}`;

import { persist } from 'zustand/middleware';

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: {},
      add: (item) =>
        set((state) => ({
          items: { ...state.items, [keyFor(item.id, item.mediaType)]: item }
        })),
      remove: (id, mediaType) =>
        set((state) => {
          const key = keyFor(id, mediaType);
          const { [key]: _removed, ...rest } = state.items;
          return { items: rest };
        }),
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
      clear: () => set({ items: {} })
    }),
    {
      name: 'watchlist-storage', // name of the item in the storage (must be unique)
    }
  )
);

