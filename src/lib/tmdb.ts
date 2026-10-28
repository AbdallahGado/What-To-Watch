import type {
  TMDBMedia,
  TMDBMediaDetails,
  TMDBMediaType,
  TMDBPerson,
  TMDBPersonDetails,
  TMDBVideo
} from './tmdb-types';
import { TRENDING, TOP_RATED, ACTORS, CONTENT } from '@/app/data/mockData';
import { MOOD_CONFIGS, type MoodConfig } from './recommendation-data';
import type { MoodId } from '@/features/recommend/types';

export type {
  TMDBMedia,
  TMDBMediaDetails,
  TMDBMediaType,
  TMDBPerson,
  TMDBPersonDetails,
  TMDBVideo
} from './tmdb-types';

// TMDB API client - server-only utilities for fetching movie/TV data.
// All functions are async and should be called only from server components or API routes.
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_REVALIDATE_SECONDS = 3600; // Increased to 1 hour for better performance

let didWarnMissing = false;

export function getTmdbApiKey() {
  const key = process.env.TMDB_API_KEY?.trim() || null;
  if (!key && !didWarnMissing) {
    console.warn('TMDB_API_KEY is not set. TMDB requests will fail. Set it in .env.local.');
    didWarnMissing = true;
  }
  return key;
}

export function hasTmdbApiKey() {
  return Boolean(getTmdbApiKey());
}

// Development mock data fallback (used only when TMDB key is missing)
const FORCE_MOCK = process.env.USE_MOCK_DATA === 'true';
const USE_MOCK = FORCE_MOCK ? true : !hasTmdbApiKey();

type TmdbListResponse<T> = { results: T[] };

type FetchOptions<T> = {
  fallback?: T;
  revalidate?: number;
};

function assignMediaType(items: TMDBMedia[], mediaType: TMDBMediaType) {
  return items.map((item) => ({
    ...item,
    media_type: item.media_type ?? mediaType
  }));
}

// Request deduplication cache to prevent duplicate API calls
const requestCache = new Map<string, Promise<unknown>>();

async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
  options: FetchOptions<T> = {}
): Promise<T> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    if (options.fallback !== undefined) return options.fallback;
    throw new Error('TMDB_API_KEY is not set.');
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
    return requestCache.get(cacheKey)! as Promise<T>;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const fetchPromise = fetch(url.toString(), {
      next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS },
      signal: controller.signal
    }).then(async (res) => {
      clearTimeout(timeoutId);
      if (!res.ok) {
        if (options.fallback !== undefined) {
          return options.fallback;
        }
        throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
      }
      return res.json() as Promise<T>;
    }).catch((error) => {
      clearTimeout(timeoutId);
      // Remove from cache on error
      requestCache.delete(cacheKey);
      if (options.fallback !== undefined) {
          console.warn(`TMDB fetch failed for ${path}, using fallback.`, error.message);
          return options.fallback;
      }
      throw error;
    });

    requestCache.set(cacheKey, fetchPromise);

    // Clean up cache after request completes
    fetchPromise.finally(() => {
      requestCache.delete(cacheKey);
    });

    return fetchPromise;
  } catch (err) {
    clearTimeout(timeoutId);
    if (options.fallback !== undefined) return options.fallback;
    throw err;
  }
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

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/trending/all/week',
    undefined,
    { fallback: { results: [] } }
  );
  return data.results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv');
}

export async function getTopRatedMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return TOP_RATED.map((c) => ({
      id: Number(c.id),
      media_type: 'movie',
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/movie/top_rated',
    undefined,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'movie');
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

  const data = await tmdbFetch<TmdbListResponse<TMDBPerson>>(
    '/person/popular',
    undefined,
    { fallback: { results: [] } }
  );
  return data.results;
}

export async function searchMulti(query: string): Promise<TMDBMedia[]> {
  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/search/multi',
    {
      query,
      include_adult: 0
    },
    { fallback: { results: [] } }
  );
  return data.results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv');
}

export async function getMovieDetails(id: string): Promise<TMDBMediaDetails | null> {
  if (USE_MOCK) {
    const c = CONTENT.find((x) => x.id === String(id) || Number(x.id) === Number(id));
    if (!c) return null;
    return {
      id: Number(c.id),
      media_type: c.type === 'series' ? 'tv' : 'movie',
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
      release_date: `${c.year}-01-01`,
      videos: { results: [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }] },
      credits: {
        cast: c.cast.map((a) => ({ id: Number(a.id), name: a.name, profile_path: a.image ?? null })),
        crew: []
      },
      similar: { results: [] }
    };
  }

  const data = await tmdbFetch<TMDBMediaDetails | null>(
    `/movie/${id}`,
    { append_to_response: 'videos,credits,similar' },
    { fallback: null }
  );
  if (!data || !data.id) return null;
  const similar = data.similar?.results
    ? { results: assignMediaType(data.similar.results, 'movie') }
    : data.similar;
  return { ...data, media_type: data.media_type ?? 'movie', similar };
}

export async function getTvDetails(id: string): Promise<TMDBMediaDetails | null> {
  if (USE_MOCK) {
    const c = CONTENT.find((x) => x.type === 'series' && (x.id === String(id) || Number(x.id) === Number(id)));
    if (!c) return null;
    return {
      id: Number(c.id),
      media_type: 'tv',
      name: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
      first_air_date: `${c.year}-01-01`,
      videos: { results: [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }] },
      credits: {
        cast: c.cast.map((a) => ({ id: Number(a.id), name: a.name, profile_path: a.image ?? null })),
        crew: []
      },
      similar: { results: [] }
    };
  }

  const data = await tmdbFetch<TMDBMediaDetails | null>(
    `/tv/${id}`,
    { append_to_response: 'videos,credits,similar' },
    { fallback: null }
  );
  if (!data || !data.id) return null;
  const similar = data.similar?.results
    ? { results: assignMediaType(data.similar.results, 'tv') }
    : data.similar;
  return { ...data, media_type: data.media_type ?? 'tv', similar };
}

export async function getPersonDetails(id: string): Promise<TMDBPersonDetails | null> {
  if (USE_MOCK) {
    const actor = ACTORS.find((a) => a.id === String(id));
    if (!actor) return null;
    return {
      id: Number(actor.id),
      name: actor.name,
      profile_path: actor.image ?? null,
      known_for_department: 'Acting',
      combined_credits: { cast: [] }
    };
  }

  const data = await tmdbFetch<TMDBPersonDetails | null>(
    `/person/${id}`,
    { append_to_response: 'combined_credits' },
    { fallback: null }
  );
  return data && data.id ? data : null;
}

type RecommendationMediaType = TMDBMediaType | 'any' | '';

export interface RecommendationInput {
  type?: RecommendationMediaType;
  mood: string;
  genres: number[];
  runtimeMinutes?: number;
  withFriends: boolean;
  language?: string;
  adventure?: string;
}

// ... existing code ...

export async function getUpcomingMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.slice(3, 6).map((c) => ({
      id: Number(c.id),
      media_type: 'movie',
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/movie/upcoming',
    undefined,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'movie');
}

export async function getNowPlayingMovies(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.slice(5, 7).map((c) => ({
      id: Number(c.id),
      media_type: 'movie',
      title: c.title,
      overview: c.description,
      poster_path: c.poster ?? null,
      backdrop_path: c.backdrop ?? null,
      vote_average: c.rating,
    })) as TMDBMedia[];
  }

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/movie/now_playing',
    undefined,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'movie');
}

export async function getTopRatedTv(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.filter((item) => item.type === 'series').map((item) => ({
      id: Number(item.id),
      media_type: 'tv',
      name: item.title,
      overview: item.description,
      poster_path: item.poster ?? null,
      backdrop_path: item.backdrop ?? null,
      vote_average: item.rating,
    }));
  }

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/tv/top_rated',
    undefined,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'tv');
}

export async function getPopularTv(): Promise<TMDBMedia[]> {
  if (USE_MOCK) {
    return CONTENT.filter((item) => item.type === 'series').map((item) => ({
      id: Number(item.id),
      media_type: 'tv',
      name: item.title,
      overview: item.description,
      poster_path: item.poster ?? null,
      backdrop_path: item.backdrop ?? null,
      vote_average: item.rating,
    }));
  }

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/tv/popular',
    undefined,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'tv');
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

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/discover/movie',
    params,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'movie');
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

  const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
    '/discover/tv',
    params,
    { fallback: { results: [] } }
  );
  return assignMediaType(data.results, 'tv');
}

export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  try {
    if (USE_MOCK) {
      // Provide a dummy trailer key for mock content so hero can try to load video
      return [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }];
    }

    const data = await tmdbFetch<TmdbListResponse<TMDBVideo>>(
      `/movie/${id}/videos`,
      undefined,
      { fallback: { results: [] } }
    );
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getTvVideos(id: number): Promise<TMDBVideo[]> {
  try {
    if (USE_MOCK) {
      return [{ key: 'dQw4w9WgXcQ', type: 'Trailer' }];
    }

    const data = await tmdbFetch<TmdbListResponse<TMDBVideo>>(
      `/tv/${id}/videos`,
      undefined,
      { fallback: { results: [] } }
    );
    return data.results ?? [];
  } catch {
    return [];
  }
}

// Pure scoring helper for the smart recommendations engine. No network
// calls: given the same inputs it always returns the same score.
export function calculateMatchScore(
  item: TMDBMedia,
  config: MoodConfig,
  targetGenres: number[],
  userGenres: number[],
  withFriends: boolean,
): number {
  let score = 0;

  // 1. Genre overlap (30 pts)
  const itemGenres = item.genre_ids || [];
  const requestedTargetGenres = targetGenres.length > 0 ? targetGenres : config.genres;
  const matchedGenres = requestedTargetGenres.filter((g) => itemGenres.includes(g));
  if (requestedTargetGenres.length > 0) {
    score += (matchedGenres.length / requestedTargetGenres.length) * 30;
  }

  // 2. Rating & popularity (20 pts)
  score += (item.vote_average || 0) * 1.5; // (Avg 7-8 -> 10.5-12 pts)
  score += Math.min((item.vote_count || 0) / 2000, 5); // (Max 5 pts)

  // 3. User-specific genres (10 pts)
  if (userGenres.some((g) => itemGenres.includes(g))) {
    score += 10;
  }

  // 4. Era bonus (5 pts) — rewards nostalgia, matching the era filter
  const era = config.era;
  if (era) {
    const date = item.release_date ?? item.first_air_date;
    if (date) {
      const year = Number.parseInt(date.slice(0, 4), 10);
      if (Number.isSafeInteger(year) && year >= era.start && year <= era.end) {
        score += 5;
      }
    }
  }

  // 5. Group fit (5 pts)
  if (withFriends && (item.vote_average || 0) > 7.5) {
    score += 5;
  }

  return score;
}

export async function getSmartRecommendations(input: RecommendationInput): Promise<TMDBMedia[]> {
  const { type, mood, genres: userGenresInput, runtimeMinutes, withFriends, language, adventure } = input;
  const config = MOOD_CONFIGS[mood as MoodId] || MOOD_CONFIGS.chill;

  const userGenres = (userGenresInput ?? []).filter(
    (g): g is number => typeof g === 'number' && Number.isSafeInteger(g) && g > 0,
  );
  const targetGenres = Array.from(new Set([...config.genres, ...userGenres]));
  const voteAverageGte = Math.max(config.voteAverageGte, withFriends ? 7.2 : 6.0);
  const voteCountGte = withFriends ? 500 : 100;

  const sortBy = adventure === 'safe' ? 'popularity.desc' : adventure === 'wild' ? 'vote_count.asc' : 'vote_average.desc';

  const commonParams: Record<string, string | number> = {
    'vote_average.gte': voteAverageGte,
    'vote_count.gte': voteCountGte,
    sort_by: sortBy,
  };

  if (targetGenres.length > 0) {
    commonParams.with_genres = targetGenres.join(',');
  }

  if (language === 'english') {
    commonParams.with_original_language = 'en';
  }

  // Fetch a larger pool of items to score (e.g., top 40)
  const fetchPool = async (mediaType: 'movie' | 'tv') => {
    const params = { ...commonParams };
    if (mediaType === 'movie' && typeof runtimeMinutes === 'number' && Number.isSafeInteger(runtimeMinutes)) {
      params['with_runtime.lte'] = runtimeMinutes;
    }

    if (config.era) {
      if (mediaType === 'movie') {
        params['primary_release_date.gte'] = `${config.era.start}-01-01`;
        params['primary_release_date.lte'] = `${config.era.end}-12-31`;
      } else {
        params['first_air_date.gte'] = `${config.era.start}-01-01`;
        params['first_air_date.lte'] = `${config.era.end}-12-31`;
      }
    }

    const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
      `/discover/${mediaType}`,
      params,
      { fallback: { results: [] } }
    );
    return assignMediaType(data.results, mediaType);
  };

  let pool: TMDBMedia[] = [];
  if (type === 'movie') {
    pool = await fetchPool('movie');
  } else if (type === 'tv') {
    pool = await fetchPool('tv');
  } else {
    const [movies, tv] = await Promise.all([fetchPool('movie'), fetchPool('tv')]);
    pool = [...movies, ...tv];
  }

  // Fallback: if strict filters returned nothing, broaden the search
  if (pool.length === 0) {
    const relaxedParams: Record<string, string | number> = { sort_by: 'popularity.desc' };
    const relaxedFetch = async (mediaType: 'movie' | 'tv') => {
      const data = await tmdbFetch<TmdbListResponse<TMDBMedia>>(
        `/discover/${mediaType}`,
        relaxedParams,
        { fallback: { results: [] } }
      );
      return assignMediaType(data.results, mediaType);
    };
    if (type === 'movie') {
      pool = await relaxedFetch('movie');
    } else if (type === 'tv') {
      pool = await relaxedFetch('tv');
    } else {
      const [movies, tv] = await Promise.all([relaxedFetch('movie'), relaxedFetch('tv')]);
      pool = [...movies, ...tv];
    }
  }

  // Score the results
  const scoredResults = pool.map((item) => ({
    ...item,
    matchScore: calculateMatchScore(item, config, targetGenres, userGenres, withFriends),
  }));

  // Sort: best match first, then richer titles, then higher rated
  return scoredResults
    .sort(
      (a, b) =>
        (b.matchScore || 0) - (a.matchScore || 0) ||
        (b.vote_count || 0) - (a.vote_count || 0) ||
        (b.vote_average || 0) - (a.vote_average || 0) ||
        (a.id || 0) - (b.id || 0),
    )
    .slice(0, 12);
}
