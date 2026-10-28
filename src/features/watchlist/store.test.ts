import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WatchlistItem } from './store';

const { addToWatchlistServer } = vi.hoisted(() => ({
  addToWatchlistServer: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/app/actions/user', () => ({
  addToWatchlist: addToWatchlistServer,
  removeFromWatchlist: vi.fn().mockResolvedValue(undefined),
  syncWatchlistItems: vi.fn().mockResolvedValue(undefined),
}));

import { useWatchlistStore } from './store';

const movie: WatchlistItem = {
  id: 42,
  mediaType: 'movie',
  title: 'Example Movie',
  posterPath: '/poster.jpg',
  year: '2024',
};

describe('watchlist store', () => {
  beforeEach(() => {
    localStorage.clear();
    useWatchlistStore.getState().setSyncEnabled(false);
    useWatchlistStore.getState().clear();
    addToWatchlistServer.mockClear();
  });

  it('adds and removes a title by media type and ID', () => {
    const store = useWatchlistStore.getState();
    store.add(movie);
    store.add({ ...movie, mediaType: 'tv', title: 'Example Series' });

    expect(useWatchlistStore.getState().isSaved(42, 'movie')).toBe(true);
    expect(useWatchlistStore.getState().isSaved(42, 'tv')).toBe(true);

    useWatchlistStore.getState().remove(42, 'movie');

    expect(useWatchlistStore.getState().isSaved(42, 'movie')).toBe(false);
    expect(useWatchlistStore.getState().isSaved(42, 'tv')).toBe(true);
  });

  it('toggles a title between saved and unsaved', () => {
    const store = useWatchlistStore.getState();

    store.toggle(movie);
    expect(useWatchlistStore.getState().isSaved(movie.id, movie.mediaType)).toBe(true);

    useWatchlistStore.getState().toggle(movie);
    expect(useWatchlistStore.getState().isSaved(movie.id, movie.mediaType)).toBe(false);
  });

  it('merges remote items with locally saved titles', () => {
    useWatchlistStore.getState().add(movie);
    useWatchlistStore.getState().hydrateFromServer([
      { ...movie, id: 43, title: 'Remote Movie' },
    ]);

    const items = useWatchlistStore.getState().items;
    expect(items['movie:42']).toEqual(movie);
    expect(items['movie:43']?.title).toBe('Remote Movie');
  });

  it('persists saved titles for a returning guest', () => {
    useWatchlistStore.getState().add(movie);

    const persisted = JSON.parse(localStorage.getItem('watchlist-storage') ?? '{}') as {
      state: { items: Record<string, WatchlistItem> };
    };
    expect(persisted.state.items['movie:42']).toEqual(movie);
  });

  it('syncs new titles only when account sync is enabled', () => {
    useWatchlistStore.getState().setSyncEnabled(true);
    useWatchlistStore.getState().add(movie);

    expect(addToWatchlistServer).toHaveBeenCalledWith({
      tmdbId: movie.id,
      title: movie.title,
      mediaType: movie.mediaType,
      poster: movie.posterPath,
    });
  });
});
