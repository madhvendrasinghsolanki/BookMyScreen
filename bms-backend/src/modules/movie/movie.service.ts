import createHttpError from "http-errors";
import { config } from "../../config/config";
import { MovieModel } from "./movie.model";
import { IMovie } from "./movie.interface";

export interface CreateMovieInput {
  title: string;
  genre?: string[] | string;
  rating: number;
  certification: string;
  duration: string;
  releaseDate: string;
  posterUrl: string;
  description: string;
}

export interface LiveMovieSearchResult {
  imdbId: string;
  title: string;
  year: string;
  poster: string | null;
}

export interface LiveMovieDetails {
  imdbId: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  certification: string;
  duration: string;
  releaseDate: string;
  posterUrl: string | null;
  description: string;
}

const normalizeGenre = (genre: CreateMovieInput["genre"]): string[] => {
  if (Array.isArray(genre)) return genre;
  return String(genre || "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
};

export const movieService = {
  async getAllMovies(): Promise<IMovie[]> {
    return MovieModel.find().lean<IMovie[]>();
  },

  async createMovie(input: CreateMovieInput): Promise<IMovie> {
    const { title, rating, certification, duration, releaseDate, posterUrl, description } = input;
    if (!title || !rating || !certification || !duration || !releaseDate || !posterUrl || !description) {
      throw createHttpError(400, "Missing required movie fields");
    }

    return MovieModel.create({
      title,
      genre: normalizeGenre(input.genre),
      rating,
      certification,
      duration,
      releaseDate,
      posterUrl,
      description,
    });
  },

  async searchLive(query: unknown): Promise<LiveMovieSearchResult[]> {
    if (!query || typeof query !== "string") {
      throw createHttpError(400, "Query parameter 'query' is required");
    }
    if (!config.omdbApiKey) {
      throw createHttpError(500, "OMDb API key is not configured on the server");
    }

    const omdbUrl = `https://www.omdbapi.com/?apikey=${config.omdbApiKey}&type=movie&s=${encodeURIComponent(query)}`;
    const response = await fetch(omdbUrl);
    const data = await response.json();

    if (data.Response === "False") {
      return [];
    }

    return (data.Search || []).map((item: Record<string, string>) => ({
      imdbId: item.imdbID,
      title: item.Title,
      year: item.Year,
      poster: item.Poster !== "N/A" ? item.Poster : null,
    }));
  },

  async getLiveById(imdbId: string): Promise<LiveMovieDetails> {
    if (!config.omdbApiKey) {
      throw createHttpError(500, "OMDb API key is not configured on the server");
    }

    const omdbUrl = `https://www.omdbapi.com/?apikey=${config.omdbApiKey}&i=${encodeURIComponent(imdbId)}&plot=full`;
    const response = await fetch(omdbUrl);
    const data = await response.json();

    if (data.Response === "False") {
      throw createHttpError(404, data.Error || "Movie not found");
    }

    return {
      imdbId: data.imdbID,
      title: data.Title,
      year: data.Year,
      genre: data.Genre,
      rating: data.imdbRating,
      certification: data.Rated,
      duration: data.Runtime,
      releaseDate: data.Released,
      posterUrl: data.Poster !== "N/A" ? data.Poster : null,
      description: data.Plot,
    };
  },
};
