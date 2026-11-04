import { NextResponse } from 'next/server';
import { getSmartRecommendations } from '@/lib/tmdb';
import type { RecommendationItem } from '@/features/recommend/types';
import { generateExplanation } from '@/lib/recommendation-explanation';
import {
  RecommendationRequestError,
  parseRecommendationRequest,
} from '@/lib/recommendation-request';
import { readJsonBody, RequestJsonError } from '@/lib/request-json';

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request, 8192);
    const parsed = parseRecommendationRequest(body);

    // Call existing TMDB logic
    const rawResults = await getSmartRecommendations({
      type: parsed.type,
      mood: parsed.mood,
      genres: parsed.genres,
      runtimeMinutes: parsed.runtimeMinutes,
      withFriends: parsed.withFriends,
      language: parsed.language,
      adventure: parsed.adventure,
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
            explanation: generateExplanation(
              { mood: parsed.mood, group: parsed.group, language: parsed.language, adventure: parsed.adventure },
              media,
            )
        };
    });

    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof RequestJsonError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RecommendationRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Recommendation API Error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
