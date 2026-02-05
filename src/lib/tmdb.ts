// TMDB API client - server-only utilities for fetching movie/TV data
// All functions are async and should be called only from server components or API routes.

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Ensure TMDB key is loaded. Next.js should load `.env.local`, but in
// some dev setups it may not be present in `process.env` at runtime.
import fs from 'fs';
import path from 'path';

let TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  try {
    const p = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const match = raw.match(/TMDB_API_KEY\s*=\s*\"?([^\"\n\r]+)\"?/);
      if (match && match[1]) {
        TMDB_API_KEY = match[1].trim();
        process.env.TMDB_API_KEY = TMDB_API_KEY;
      }
    }
  } catch (e) {
    // ignore
  }

  if (!TMDB_API_KEY) {
    console.warn(
      'TMDB_API_KEY is not set. TMDB requests will fail. Set it in .env.local'
    );
  }
}

// Development mock data fallback (used only when TMDB key is missing)
import { TRENDING, TOP_RATED, ACTORS, CONTENT } from '@/app/data/mockData';
const USE_MOCK = process.env.USE_MOCK_DATA === 'true' || !TMDB_API_KEY;

type TMDBMediaType = 'movie' | 'tv';

export interface TMDBMedia {
  id: number;
  media_type?: TMDBMediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  biography?: string;
}

// Request deduplication cache to prevent duplicate API calls
const requestCache = new Map<string, Promise<any>>();

async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
  fallback?: T
): Promise<T> {
  // Resolve API key at call-time: prefer process.env but fall back to reading
  // `.env.local` on disk. This handles dev setups where Next didn't populate
  // `process.env` for some reason.
  let apiKey = process.env.TMDB_API_KEY ?? TMDB_API_KEY;
  if (!apiKey) {
    try {
      const p = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const match = raw.match(/TMDB_API_KEY\s*=\s*\"?([^\"\n\r]+)\"?/);
        if (match && match[1]) apiKey = match[1].trim();
      }
    } catch (e) {
      // ignore
    }
  }

  if (!apiKey) {
    if (fallback !== undefined) return fallback;
    return {} as T;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const cacheKey = url.toString();

  // Return cached promise if request is in flight to deduplicate requests
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  const fetchPromise = fetch(url.toString(), {
    next: { revalidate: 60 }
  }).then(async (res) => {
    if (!res.ok) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }).catch((error) => {
    // Remove from cache on error
    requestCache.delete(cacheKey);
    throw error;
  });

  requestCache.set(cacheKey, fetchPromise);

  // Clean up cache after request completes
  fetchPromise.finally(() => {
    requestCache.delete(cacheKey);
  });

  return fetchPromise;
}

export async function getTrending(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return TRENDING.map((c) => ({
      id: Number(c.id),
      media_type: c.type === 'series' ? 'tv' : 'movie',
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/trending/all/week',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function getTopRatedMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return TOP_RATED.map((c) => ({
      id: Number(c.id),
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/movie/top_rated',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function getPopularPeople(): Promise<TMDBPerson[]> {
  if (USE_MOCK) {
    return ACTORS.map((a, idx) => ({
      id: idx + 1,
      name: a.name,
      profile_path: a.image ?? null,
      known_for_department: 'Acting',
    })) as TMDBPerson[];
  }

  const data = await tmdbFetch<{ results: TMDBPerson[] }>(
    '/person/popular',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function searchMulti(query: string): Promise<TMDBMedia[]> {
  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/search/multi',
    {
      query,
      include_adult: 0
    },
    { results: [] }
  );
  return data.results;
}

export async function getMovieDetails(id: string) {
  if (USE_MOCK) {
    const c = CONTENT.find((x) => x.id === String(id) || Number(x.id) === Number(id));
    if (!c) return {} as any;
    return {
      id: Number(c.id),
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
      videos: { results: [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }] },
      credits: { cast: c.cast.map((a) => ({ id: a.id, name: a.name, profile_path: a.image })) }
    } as any;
  }

  return tmdbFetch(`/movie/${id}`, { append_to_response: 'videos,credits,similar' }, {} as any);
}

export async function getTvDetails(id: string) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: 'videos,credits,similar' }, {} as any);
}

export async function getPersonDetails(id: string) {
  return tmdbFetch(`/person/${id}`, { append_to_response: 'combined_credits' }, {} as any);
}

export interface RecommendationInput {
  type?: 'movie' | 'tv' | 'any' | '';
  mood: string;
  genres: number[];
  runtimeMinutes?: number;
  withFriends: boolean;
  language?: string;
}

// ... existing code ...

export async function getUpcomingMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.slice(3, 6).map((c) => ({
      id: Number(c.id),
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/movie/upcoming',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function getNowPlayingMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.slice(5, 7).map((c) => ({
      id: Number(c.id),
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/movie/now_playing',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function getTopRatedTv(): Promise<TMDBMedia[]> {
  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/tv/top_rated',
    undefined,
    { results: [] }
  );
  return data.results;
}

export async function getDiscoverMovies(genre?: string, sort: string = 'popularity.desc', page: number = 1): Promise<TMDBMedia[]> {
  const params: Record<string, string | number | undefined> = {
    sort_by: sort,
    include_adult: 0,
    include_video: 'true',
    'vote_count.gte': 50,
    page: page
  };

  if (genre && genre !== 'all') {
    params.with_genres = genre;
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/discover/movie',
    params,
    { results: [] }
  );
  return data.results;
}

export async function getDiscoverTv(genre?: string, sort: string = 'popularity.desc', page: number = 1): Promise<TMDBMedia[]> {
  const params: Record<string, string | number | undefined> = {
    sort_by: sort,
    include_adult: 0,
    'vote_count.gte': 50,
    page: page
  };

  if (genre && genre !== 'all') {
    params.with_genres = genre;
  }

  const data = await tmdbFetch<{ results: TMDBMedia[] }>(
    '/discover/tv',
    params,
    { results: [] }
  );
  return data.results;
}

export async function getMovieVideos(id: number): Promise<{ key: string; type: string }[]> {
  try {
    if (USE_MOCK) {
      // Provide a dummy trailer key for mock content so hero can try to load video
      return [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }];
    }

    const data = await tmdbFetch<{ results?: { key: string; type: string }[] }>(`/movie/${id}/videos`);
    return data.results ?? [];
  } catch (e) {
    return [];
  }
}

export async function getTvVideos(id: number): Promise<{ key: string; type: string }[]> {
  try {
    if (USE_MOCK) {
      return [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }];
    }

    const data = await tmdbFetch<{ results?: { key: string; type: string }[] }>(`/tv/${id}/videos`);
    return data.results ?? [];
  } catch (e) {
    return [];
  }
}

interface SmartRecommendInput extends RecommendationInput {
    type?: 'movie' | 'tv' | 'any' | '';
}

export async function getSmartRecommendations(input: SmartRecommendInput): Promise<TMDBMedia[]> {
  const { type, mood, genres, runtimeMinutes, withFriends, language } = input;

  const voteAverageGte = mood === 'light' ? 6 : 7;
  const sortBy = mood === 'experimental' ? 'vote_count.desc' : 'popularity.desc';
  const voteCountGte = withFriends ? 300 : 50;
  
  const commonParams: any = {
    with_genres: genres.join(','),
    sort_by: sortBy,
    'vote_average.gte': voteAverageGte,
    'vote_count.gte': voteCountGte
  };

  if (language === 'english') {
      commonParams.with_original_language = 'en';
  }

  // Helper to fetch movies
  const fetchMovies = async () => {
      const params = { ...commonParams };
      // Runtime works reliably for movies
      if (runtimeMinutes) {
          params['with_runtime.lte'] = runtimeMinutes;
      }
      return tmdbFetch<{ results: TMDBMedia[] }>(
        '/discover/movie',
        params,
        { results: [] }
      );
  };

  // Helper to fetch TV
  const fetchTv = async () => {
      const params = { ...commonParams };
      // TV runtime is per episode, usually "runtimeMinutes" from UI is session length
      // If user wants "Short" (<90m), most TV eps fit. 
      // If user wants "Long" (>150m), that's harder to filter by ep length.
      // We'll skip runtime filter for TV unless it's very short to avoid 2 min clips?
      // Actually TMDB discover TV `with_runtime` is episode runtime.
      if (runtimeMinutes && runtimeMinutes < 60) {
           params['with_runtime.lte'] = runtimeMinutes; 
      }
      return tmdbFetch<{ results: TMDBMedia[] }>(
        '/discover/tv',
        params,
        { results: [] }
      );
  };

  let results: TMDBMedia[] = [];

  if (type === 'movie') {
      const data = await fetchMovies();
      results = data.results;
  } else if (type === 'tv') {
      const data = await fetchTv();
      results = data.results;
  } else {
      // "Surprise Me" -> Fetch both and mix
      const [movies, tv] = await Promise.all([fetchMovies(), fetchTv()]);
      
      // Simple Interleaving or Sorting by Popularity
      // Let's mix them 50/50 then sort by vote/popularity
      const combined = [...movies.results, ...tv.results];
      // Shuffle slightly or sort by popularity?
      // Let's sort by popularity desc
      results = combined.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }

  return results;
}

