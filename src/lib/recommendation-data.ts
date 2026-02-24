import { MoodId } from '@/features/recommend/types';

export interface MoodConfig {
  genres: number[];
  keywords: string[];
  era?: { start: number; end: number };
  voteAverageGte: number;
  explanation: string;
}

export const MOOD_CONFIGS: Record<MoodId, MoodConfig> = {
  chill: {
    genres: [35, 10751, 16], // Comedy, Family, Animation
    keywords: ['slice of life', 'feel good', 'comforting', 'gentle'],
    voteAverageGte: 6.5,
    explanation: 'Perfect for when you just want to relax and turn off your brain.',
  },
  happy: {
    genres: [35, 10749, 10751], // Comedy, Romance, Family
    keywords: ['uplifting', 'humor', 'optimistic', 'inspiring'],
    voteAverageGte: 7.0,
    explanation: 'Designed to put a smile on your face and restore your faith in humanity.',
  },
  romantic: {
    genres: [10749, 18], // Romance, Drama
    keywords: ['love', 'passion', 'relationship', 'swoon-worthy', 'chemistry'],
    voteAverageGte: 6.8,
    explanation: 'Stories that capture the magic, complexity, and beauty of love.',
  },
  sad: {
    genres: [18, 10752, 36], // Drama, War, History
    keywords: ['tearjerker', 'melancholy', 'emotional', 'heartbreaking', 'grief'],
    voteAverageGte: 7.2,
    explanation: 'Sometimes you just need a good cry. These will get the tears flowing.',
  },
  excited: {
    genres: [28, 12, 53, 878], // Action, Adventure, Thriller, Sci-Fi
    keywords: ['adrenaline', 'high stakes', 'action packed', 'thrilling', 'blockbuster'],
    voteAverageGte: 6.5,
    explanation: 'Fast-paced and exciting. Prepare for some major adrenaline hits.',
  },
  thoughtful: {
    genres: [18, 9648, 878, 99], // Drama, Mystery, Sci-Fi, Documentary
    keywords: ['mind-bending', 'philosophical', 'complex', 'mystery', 'intellectual'],
    voteAverageGte: 7.5,
    explanation: 'Deep stories that will keep you thinking long after the credits roll.',
  },
  nostalgic: {
    genres: [12, 10751, 14, 28], // Adventure, Family, Fantasy, Action
    keywords: ['classic', 'retro', '80s', '90s', 'childhood', 'legendary'],
    era: { start: 1970, end: 2010 },
    voteAverageGte: 7.0,
    explanation: 'Timeless classics and retro vibes that feel like comfort food.',
  },
  dark: {
    genres: [27, 80, 53, 9648], // Horror, Crime, Thriller, Mystery
    keywords: ['disturbing', 'gritty', 'psychological', 'twisted', 'atmospheric', 'noir'],
    voteAverageGte: 6.8,
    explanation: 'Into the shadows. These are gritty, dark, and potentially bone-chilling.',
  },
  inspiring: {
    genres: [99, 18, 36], // Documentary, Drama, History
    keywords: ['true story', 'overcoming odds', 'heroic', 'motivational', 'monumental'],
    voteAverageGte: 7.5,
    explanation: 'Stories of real courage and achievement that will leave you motivated.',
  },
};
