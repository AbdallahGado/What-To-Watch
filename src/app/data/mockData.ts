
export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series';
  rating: number;
  year: number;
  poster: string;
  backdrop: string;
  genres: string[];
  duration: string;
  description: string;
  cast: Actor[];
  director?: string;
  matchScore?: number; // For recommendation
  moods?: string[];
}

export interface Actor {
  id: string;
  name: string;
  image: string;
  role?: string;
}

export const MOODS = [
  { id: 'happy', label: 'Feel Good', emoji: '😊', color: 'bg-yellow-500' },
  { id: 'sad', label: 'Emotional', emoji: '😢', color: 'bg-blue-500' },
  { id: 'excited', label: 'Thrilling', emoji: '🤩', color: 'bg-red-500' },
  { id: 'chill', label: 'Relaxed', emoji: '😌', color: 'bg-green-500' },
  { id: 'romantic', label: 'Romantic', emoji: '🥰', color: 'bg-pink-500' },
  { id: 'scared', label: 'Spooky', emoji: '😱', color: 'bg-purple-500' },
  { id: 'thoughtful', label: 'Mind-bending', emoji: '🤔', color: 'bg-indigo-500' },
];

export const GENRES = [
  'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Adventure'
];

export const ACTORS: Actor[] = [
  { id: '1', name: 'Timothée Chalamet', image: 'https://images.unsplash.com/photo-1618673827854-0065d21af001?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Zendaya', image: 'https://images.unsplash.com/photo-1659303979849-26016aebf76a?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Oscar Isaac', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Florence Pugh', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
];

export const CONTENT: Content[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    type: 'movie',
    rating: 8.9,
    year: 2024,
    poster: 'https://images.unsplash.com/photo-1653045474061-075ba29db54f?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1653045474061-075ba29db54f?auto=format&fit=crop&w=1920&q=80',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '2h 46m',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    cast: [ACTORS[0], ACTORS[1], ACTORS[2], ACTORS[3]],
    director: 'Denis Villeneuve',
    moods: ['excited', 'thoughtful']
  },
  {
    id: '2',
    title: 'The Dark Knight',
    type: 'movie',
    rating: 9.0,
    year: 2008,
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Thriller', 'Crime'],
    duration: '2h 32m',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    cast: [ACTORS[0]],
    director: 'Christopher Nolan',
    moods: ['excited', 'scared']
  },
  {
    id: '3',
    title: 'Interstellar',
    type: 'movie',
    rating: 8.7,
    year: 2014,
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: '2h 49m',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    cast: [ACTORS[2]],
    director: 'Christopher Nolan',
    moods: ['thoughtful', 'sad', 'excited']
  },
  {
    id: '4',
    title: 'La La Land',
    type: 'movie',
    rating: 8.0,
    year: 2016,
    poster: 'https://images.unsplash.com/photo-1719405524206-30751869956f?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1719405524206-30751869956f?auto=format&fit=crop&w=1920&q=80',
    genres: ['Romance', 'Drama', 'Music'],
    duration: '2h 8m',
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    cast: [ACTORS[0]],
    director: 'Damien Chazelle',
    moods: ['romantic', 'happy', 'sad']
  },
  {
    id: '5',
    title: 'Cyberpunk: Edgerunners',
    type: 'series',
    rating: 8.3,
    year: 2022,
    poster: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?auto=format&fit=crop&w=1920&q=80',
    genres: ['Sci-Fi', 'Action', 'Animation'],
    duration: '1 Season',
    description: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
    cast: [],
    moods: ['excited', 'sad']
  },
  {
    id: '6',
    title: 'Drive',
    type: 'movie',
    rating: 7.8,
    year: 2011,
    poster: 'https://images.unsplash.com/photo-1658754640103-4e28e7c7a6a4?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1658754640103-4e28e7c7a6a4?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Drama'],
    duration: '1h 40m',
    description: 'A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps out his neighbor.',
    cast: [ACTORS[2]],
    moods: ['excited', 'chill']
  },
  {
    id: '7',
    title: 'Midnight in Paris',
    type: 'movie',
    rating: 7.7,
    year: 2011,
    poster: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80',
    genres: ['Romance', 'Fantasy', 'Comedy'],
    duration: '1h 34m',
    description: 'While on a trip to Paris with his fiancée\'s family, a nostalgic screenwriter finds himself mysteriously going back to the 1920s everyday at midnight.',
    cast: [],
    moods: ['chill', 'romantic', 'happy']
  }
];

export const TRENDING = [CONTENT[0], CONTENT[2], CONTENT[4], CONTENT[1]];
export const TOP_RATED = [CONTENT[1], CONTENT[0], CONTENT[2], CONTENT[3]];
