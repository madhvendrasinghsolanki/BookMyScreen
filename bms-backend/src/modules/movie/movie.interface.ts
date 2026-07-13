import { Types } from "mongoose";

export interface IMovie {
  _id?: Types.ObjectId | string;
  title: string;
  genre: string[];
  rating: number;
  certification: string;
  duration: string;
  releaseDate: string;
  posterUrl: string;
  description: string;
}
