import mongoose, { Schema, Document } from "mongoose";

export interface IBooking {
  _id?: mongoose.Types.ObjectId | string;
  user?: mongoose.Types.ObjectId | string;
  movieTitle: string;
  moviePoster?: string;
  city: string;
  theaterName: string;
  showTime: string;
  showDate: string;
  seatType: string;
  seats: string[];
  ticketCount: number;
  amount: number;
  status?: "Confirmed" | "Pending" | "Cancelled";
  createdAt?: Date;
}

export type IBookingDocument = Document & IBooking;

const bookingSchema = new Schema<IBookingDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String },
  city: { type: String, required: true },
  theaterName: { type: String, required: true },
  showTime: { type: String, required: true },
  showDate: { type: String, required: true },
  seatType: { type: String, required: true },
  seats: [{ type: String }],
  ticketCount: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Confirmed" },
  createdAt: { type: Date, default: Date.now },
});

export const BookingModel = mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", bookingSchema);
