export interface Movie {
  id: number;
  name: string;
  description: string;
  poster_url?: string;
  release_date?: string;
  duration?: number; // in minutes
}
