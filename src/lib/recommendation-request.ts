import type { TMDBMedia } from './tmdb-types';
import type { MoodConfig } from './recommendation-data';
import type {
  AdventureId,
  GroupId,
  LanguageId,
  MediaTypeId,
  MoodId,
} from '@/features/recommend/types';
import { MOOD_CONFIGS } from './recommendation-data';

export interface ParsedRecommendationRequest {
  type: MediaTypeId;
  mood: MoodId;
  genres: number[];
  runtimeMinutes?: number;
  group: GroupId;
  language: LanguageId;
  adventure: AdventureId;
  withFriends: boolean;
}

export class RecommendationRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecommendationRequestError';
  }
}

const MEDIA_TYPES: readonly string[] = ['movie', 'tv', 'any', ''];
const GROUPS: readonly string[] = ['solo', 'date', 'friends', 'family', ''];
const LANGUAGES: readonly string[] = ['any', 'english', ''];
const ADVENTURES: readonly string[] = ['safe', 'balanced', 'wild', ''];

function parseGenres(value: unknown): number[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new RecommendationRequestError('Genres must be an array of genre IDs.');
  }
  return value.map((genre) => {
    const id = typeof genre === 'string' && genre.trim() !== '' ? Number(genre) : genre;
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
      throw new RecommendationRequestError('Genres must be an array of genre IDs.');
    }
    return id;
  });
}

function parseRuntimeMinutes(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const minutes = typeof value === 'string' ? Number(value) : value;
  if (typeof minutes !== 'number' || !Number.isSafeInteger(minutes) || minutes < 30 || minutes > 600) {
    throw new RecommendationRequestError('Runtime must be an integer between 30 and 600 minutes.');
  }
  return minutes;
}

export function parseRecommendationRequest(body: unknown): ParsedRecommendationRequest {
  if (typeof body !== 'object' || body === null) {
    throw new RecommendationRequestError('Recommendation request must be an object.');
  }
  const input = body as Record<string, unknown>;

  const type = (input.type as string) ?? '';
  if (!MEDIA_TYPES.includes(type)) {
    throw new RecommendationRequestError('Type must be movie, tv, or any.');
  }

  const mood = input.mood as string;
  if (typeof mood !== 'string' || !(mood in MOOD_CONFIGS)) {
    throw new RecommendationRequestError('Mood is required and must be a supported mood.');
  }

  const group = (input.group as string) ?? '';
  if (!GROUPS.includes(group)) {
    throw new RecommendationRequestError('Group must be solo, date, friends, or family.');
  }

  const language = (input.language as string) ?? '';
  if (!LANGUAGES.includes(language)) {
    throw new RecommendationRequestError('Language must be any or english.');
  }

  const adventure = (input.adventure as string) ?? '';
  if (!ADVENTURES.includes(adventure)) {
    throw new RecommendationRequestError('Adventure must be safe, balanced, or wild.');
  }

  return {
    type: type as MediaTypeId,
    mood: mood as MoodId,
    genres: parseGenres(input.genres),
    runtimeMinutes: parseRuntimeMinutes(input.runtimeMinutes),
    group: group as GroupId,
    language: language as LanguageId,
    adventure: adventure as AdventureId,
    withFriends: group !== 'solo' && group !== '',
  };
}

export function getMoodConfig(mood: MoodId): MoodConfig {
  return MOOD_CONFIGS[mood] ?? MOOD_CONFIGS.chill;
}

export type { TMDBMedia };
