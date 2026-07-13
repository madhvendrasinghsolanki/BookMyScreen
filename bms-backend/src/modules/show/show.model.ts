import mongoose, { Schema, Document } from "mongoose";
import { IShow } from "./show.interface";

export type IShowDocument = Document & IShow;

const showSchema = new Schema<IShowDocument>({
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  theater: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
  city: { type: String },
  date: { type: String },
  startTime: { type: String },
  format: { type: String },
  audioType: { type: String },
});

export const ShowModel =
  mongoose.models.Show || mongoose.model<IShowDocument>("Show", showSchema);
