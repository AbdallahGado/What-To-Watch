export type MoodId =
  | 'chill'
  | 'happy'
  | 'romantic'
  | 'sad'
  | 'excited'
  | 'thoughtful'
  | 'nostalgic'
  | 'dark'
  | 'inspiring';

export type TimeId = 'short' | 'movie' | 'long' | 'binge' | '';
export type GroupId = 'solo' | 'date' | 'friends' | 'family' | '';
export type LanguageId = 'any' | 'english' | '';
export type MediaTypeId = 'movie' | 'tv' | 'any' | '';

export interface RecommendationFormState {
  type: MediaTypeId;
  mood: MoodId | '';
  genres: number[];
  time: TimeId;
  group: GroupId;
  language: LanguageId;
}

export interface RecommendationExplanation {
  reason: string;
  factors: string[];
}

export interface RecommendationItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  year?: string;
  explanation: RecommendationExplanation;
}

