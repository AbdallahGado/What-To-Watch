export type TMDBMediaType = 'movie' | 'tv';

export interface TMDBMedia {
  id: number;
  media_type?: TMDBMediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  biography?: string;
}

export interface TMDBVideo {
  key: string;
  type: string;
  site?: string;
  name?: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job?: string;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBProductionCompany {
  id: number;
  name: string;
}

export interface TMDBMediaDetails extends TMDBMedia {
  tagline?: string;
  status?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  videos?: { results: TMDBVideo[] };
  credits?: TMDBCredits;
  similar?: { results: TMDBMedia[] };
  created_by?: TMDBCrewMember[];
  production_companies?: TMDBProductionCompany[];
}

export interface TMDBPersonDetails extends TMDBPerson {
  combined_credits?: { cast: TMDBMedia[] };
}
