import { Types } from "mongoose";
import { IMovie } from "../movie/movie.interface";
import { IThreater } from "../theater/theater.interface";

export interface IShow {
  _id?: Types.ObjectId | string;
  movie: Types.ObjectId | IMovie;
  theater: Types.ObjectId | IThreater;
  city?: string;
  date?: string;
  startTime?: string;
  format?: string;
  audioType?: string;
}
