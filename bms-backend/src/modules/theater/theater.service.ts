import createHttpError from "http-errors";
import { TheaterModel } from "./theater.model";
import { IThreater } from "./theater.interface";

export interface CreateTheaterInput {
  name: string;
  location: string;
  city?: string;
  state?: string;
  logo?: string;
}

export const theaterService = {
  async getAllTheaters(): Promise<IThreater[]> {
    return TheaterModel.find().lean<IThreater[]>();
  },

  async createTheater(input: CreateTheaterInput): Promise<IThreater> {
    const { name, location, city, state, logo } = input;
    if (!name || !location) {
      throw createHttpError(400, "Name and location are required");
    }
    return TheaterModel.create({ name, location, city, state, logo });
  },
};
