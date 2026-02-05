import { NextResponse } from 'next/server';
import { getSmartRecommendations, TMDBMedia } from '@/lib/tmdb';
import { RecommendationItem, RecommendationExplanation } from '@/features/recommend/types';

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
      withFriends: group !== 'solo', // Fallback for basic logic
      language
    });

    // Map to RecommendationItem structure expected by client
    const results: RecommendationItem[] = rawResults.slice(0, 5).map((media) => {
        return {
            id: media.id,
            mediaType: media.media_type || (media.title ? 'movie' : 'tv'), // Infer if missing from discover
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

function generateExplanation(mood: string, group: string, language: string, media: TMDBMedia): RecommendationExplanation {
    const factors = [];
    
    // Group Dynamics
    if (group === 'date' && media.vote_average > 7) factors.push('Safe bet for date night');
    if (group === 'family') factors.push('Family friendly choice');
    if (group === 'friends') factors.push('Fun to watch with a crowd');
    if (group === 'solo') factors.push('Great for a solo deep dive');

    // Mood Matching
    if (mood === 'nostalgic') factors.push('Classic feel');
    if (mood === 'dark') factors.push('Dark and psychological');
    if (mood === 'inspiring') factors.push('Thought provoking');

    // Language
    if (language === 'any' && media.original_language && media.original_language !== 'en') factors.push('Internationally acclaimed');

    // Generic
    if (media.vote_average > 8) factors.push('Critically acclaimed');
    
    return {
        reason: `Matches your "${mood}" vibe perfectly.`,
        factors: factors.length > 0 ? factors : ['Trending in this genre', 'Matches your time preference']
    };
}
