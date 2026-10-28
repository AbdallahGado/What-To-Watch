import type { TMDBMedia } from './tmdb-types';
import type { MoodId, RecommendationExplanation } from '@/features/recommend/types';
import { MOOD_CONFIGS } from './recommendation-data';

const FUNNY_REASONS: Record<string, string> = {
  chill: 'Low-stakes viewing for when your brain is on power-save mode.',
  happy: 'Turn that frown upside down — or at least sideways.',
  romantic: 'Love is in the air. Or at least on the screen.',
  sad: 'Lean into the feels. Bring tissues. And ice cream.',
  excited: 'Buckle up. Things are about to get intense.',
  thoughtful: 'For when you want to question your life choices.',
  nostalgic: 'Remember when things were simpler? They weren\u2019t, but pretend.',
  dark: 'Embrace the chaos. It\u2019s fine. Everything\u2019s fine.',
  inspiring: 'Because you need a reminder that people do good things sometimes.',
};

export interface ExplanationContext {
  mood: string;
  group?: string;
  language?: string;
  adventure?: string;
}

export function generateExplanation(
  mood: string,
  group: string | undefined,
  language: string | undefined,
  adventure: string | undefined,
  media: TMDBMedia,
): RecommendationExplanation;
export function generateExplanation(context: ExplanationContext, media: TMDBMedia): RecommendationExplanation;
export function generateExplanation(
  moodOrContext: string | ExplanationContext,
  groupOrMedia: string | undefined | TMDBMedia,
  language?: string,
  adventure?: string,
  mediaArg?: TMDBMedia,
): RecommendationExplanation {
  const context: ExplanationContext =
    typeof moodOrContext === 'string'
      ? { mood: moodOrContext, group: groupOrMedia as string, language, adventure }
      : moodOrContext;
  const media = (typeof moodOrContext === 'string' ? mediaArg : groupOrMedia) as TMDBMedia;

  const factors: string[] = [];
  const config = MOOD_CONFIGS[context.mood as MoodId];
  const itemGenres = media.genre_ids || [];
  const year = parseInt((media.release_date || media.first_air_date)?.split('-')[0] || '0', 10);

  if (config?.genres.some((g) => itemGenres.includes(g))) {
    factors.push(`Checks your ${context.mood} boxes`);
  }

  if (media.vote_average > 8) factors.push('Critically acclaimed — your snobby friend will approve');
  else if (media.vote_average > 7) factors.push('Solid 7+ — better than most of your exes');
  else if (media.vote_average > 6) factors.push('Mid-tier but committed — like a stable relationship');
  else factors.push('Not the highest rated, but hey, neither are we');

  if (config?.era && year >= config.era.start && year <= config.era.end) {
    factors.push(`Certified classic (${year}) — older than some of your relationships`);
  }

  if (context.group === 'date') factors.push('Date-night safe — won\u2019t kill the mood');
  if (context.group === 'family') factors.push('Family-safe — grandma won\u2019t cover her eyes');
  if (context.group === 'friends') factors.push('Crowd-pleaser — even your picky friend will like it');
  if (context.group === 'solo') factors.push('Solo-approved — no sharing the popcorn');

  if (context.language === 'any' && media.original_language && media.original_language !== 'en') {
    factors.push('International flair — subtitles make you look cultured');
  }

  if (context.adventure === 'wild') factors.push('Deep cut — you won\u2019t find this on everyone\u2019s homepage');
  if (context.adventure === 'safe') factors.push('Crowd favorite — safe, reliable, no surprises');

  return {
    reason: FUNNY_REASONS[context.mood] || `A decent pick for your ${context.mood} mood.`,
    factors: factors.length > 0 ? factors : ['Trending pick for you', 'Strong thematic match'],
  };
}
