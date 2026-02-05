
'use server';

import { getDiscoverMovies, getDiscoverTv, TMDBMedia, searchMulti } from '@/lib/tmdb';

/**
 * Fetches movies with improved error handling and validation
 */
export async function fetchMovies(genre: string, sort: string, page: number = 1): Promise<TMDBMedia[]> {
  try {
    // Validate inputs
    if (!sort || typeof sort !== 'string') {
      throw new Error('Invalid sort parameter');
    }
    
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    const movies = await getDiscoverMovies(genre, sort, page);
    
    // Filter out results without essential data
    return movies.filter(movie => movie.id && (movie.title || movie.name));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch movies:', errorMessage);
    throw new Error(`Failed to fetch movies: ${errorMessage}`);
  }
}

/**
 * Fetches TV series with improved error handling and validation
 */
export async function fetchSeries(genre: string, sort: string, page: number = 1): Promise<TMDBMedia[]> {
  try {
    // Validate inputs
    if (!sort || typeof sort !== 'string') {
      throw new Error('Invalid sort parameter');
    }
    
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    const series = await getDiscoverTv(genre, sort, page);
    
    // Filter out results without essential data
    return series.filter(show => show.id && (show.title || show.name));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch series:', errorMessage);
    throw new Error(`Failed to fetch series: ${errorMessage}`);
  }
}

/**
 * Searches for movies and TV shows with optimized debouncing
 */
export async function searchMultiMedia(query: string): Promise<TMDBMedia[]> {
  try {
    if (!query || typeof query !== 'string') {
      return [];
    }

    // Trim query and check minimum length
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return [];
    }

    const results = await searchMulti(trimmedQuery);
    
    // Filter for quality results with poster images and valid media types
    return results.filter(
      item => item.id && (item.title || item.name) && item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to search media:', errorMessage);
    // Return empty array instead of throwing to gracefully handle search failures
    return [];
  }
}
