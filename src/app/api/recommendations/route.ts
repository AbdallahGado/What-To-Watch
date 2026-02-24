import { NextResponse } from 'next/server';
import { getSmartRecommendations } from '@/lib/tmdb';
import { RecommendationItem, RecommendationExplanation, MoodId } from '@/features/recommend/types';
import { MOOD_CONFIGS } from '@/lib/recommendation-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, mood, genres, runtimeMinutes, group, language } = body;

    // Call existing TMDB logic
    const rawResults = await getSmartRecommendations({
      type,
      mood,
      genres,
      runtimeMinutes,
      withFriends: group !== 'solo',
      language
    });

    // Map to RecommendationItem structure expected by client
    const results: RecommendationItem[] = rawResults.slice(0, 5).map((media) => {
        return {
            id: media.id,
            mediaType: media.media_type || (media.title ? 'movie' : 'tv'),
            title: media.title || media.name || 'Untitled',
            overview: media.overview,
            posterPath: media.poster_path,
            voteAverage: media.vote_average,
            year: (media.release_date || media.first_air_date)?.split('-')[0],
            explanation: generateExplanation(mood, group, language, media)
        };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

function generateExplanation(mood: string, group: string, language: string, media: any): RecommendationExplanation {
    const factors = [];
    const config = MOOD_CONFIGS[mood as MoodId];
    
    // Genre Match
    const itemGenres = media.genre_ids || [];
    if (config?.genres.some(g => itemGenres.includes(g))) {
        factors.push(`Matches your ${mood} vibe`);
    }

    // Rating
    if (media.vote_average > 8) factors.push('Critically acclaimed masterpiece');
    else if (media.vote_average > 7) factors.push('Highly rated by the community');

    // Era
    if (config?.era) {
        const year = parseInt((media.release_date || media.first_air_date)?.split('-')[0]);
        if (year >= config.era.start && year <= config.era.end) {
            factors.push(`Classic era pick (${year})`);
        }
    }

    // Group Dynamics
    if (group === 'date') factors.push('Perfectly paced for date night');
    if (group === 'family') factors.push('Wholesome and family-safe');
    if (group === 'friends') factors.push('Highly rewatchable with a group');

    // Language
    if (language === 'any' && media.original_language && media.original_language !== 'en') {
        factors.push('Top-tier international cinema');
    }
    
    return {
        reason: config?.explanation || `A great match for your current vibe.`,
        factors: factors.length > 0 ? factors : ['Trending pick for you', 'Strong thematic match']
    };
}
