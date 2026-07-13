import createHttpError from "http-errors";
import { ShowModel } from "./show.model";
import { IShow } from "./show.interface";

export interface ShowFilters {
  movieId?: string;
  city?: string;
}

export interface CreateShowInput {
  movie: string;
  theater: string;
  city?: string;
  date?: string;
  startTime?: string;
  format?: string;
  audioType?: string;
}

export const showService = {
  async getShows(filters: ShowFilters): Promise<IShow[]> {
    const query: Record<string, unknown> = {};
    if (filters.movieId) query.movie = filters.movieId;
    if (filters.city) query.city = filters.city;
    return ShowModel.find(query).populate("movie theater").lean<IShow[]>();
  },

  async createShow(input: CreateShowInput): Promise<IShow> {
    const { movie, theater, city, date, startTime, format, audioType } = input;
    if (!movie || !theater) {
      throw createHttpError(400, "Movie and theater are required");
    }
    return ShowModel.create({ movie, theater, city, date, startTime, format, audioType });
  },
};
