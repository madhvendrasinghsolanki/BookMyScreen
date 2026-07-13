import mongoose, { Schema, Document } from "mongoose";
import { IThreater } from "./theater.interface";

export type ITheaterDocument = Document & IThreater;

const theaterSchema = new Schema<ITheaterDocument>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  logo: { type: String },
});

export const TheaterModel =
  mongoose.models.Theater || mongoose.model<ITheaterDocument>("Theater", theaterSchema);
