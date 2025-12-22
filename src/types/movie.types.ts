export interface Movie {
  id: number;
  name: string;
  description: string;
  poster_url?: string;
  release_date?: string;
  duration?: number; // in minutes
  genres?: Genre[];
  certificate?: Certificate;
  workers?: Worker[];
}
interface Certificate {
  name: string;
  age: number;
}
interface Genre {
  id: number;
  name: string;
}
interface Worker {
  id: number;
  image_url: string;
  introduction: string;
  name: string;
  type: "cast" | "crew";
}
