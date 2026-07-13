import mongoose, { Schema, Document } from "mongoose";
import { IMovie } from "./movie.interface";

export type IMovieDocument = Document & IMovie;

const movieSchema = new Schema<IMovieDocument>({
  title: { type: String, required: true },
  genre: [{ type: String }],
  rating: { type: Number, required: true },
  certification: { type: String, required: true },
  duration: { type: String, required: true },
  releaseDate: { type: String, required: true },
  posterUrl: { type: String, required: true },
  description: { type: String, required: true },
});

export const MovieModel =
  mongoose.models.Movie || mongoose.model<IMovieDocument>("Movie", movieSchema);
