import createHttpError from "http-errors";
import { BookingModel, IBooking } from "./booking.model";

export interface CreateBookingInput {
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
}

export const bookingService = {
  async createBooking(userId: string, input: CreateBookingInput): Promise<IBooking> {
    const { movieTitle, moviePoster, city, theaterName, showTime, showDate, seatType, seats, ticketCount, amount } =
      input;

    if (!movieTitle || !city || !theaterName || !showTime || !showDate || !seatType || !Array.isArray(seats) || seats.length === 0) {
      throw createHttpError(400, "Missing required booking fields");
    }
    if (typeof ticketCount !== "number" || ticketCount <= 0 || ticketCount !== seats.length) {
      throw createHttpError(400, "ticketCount must match the number of seats");
    }
    if (typeof amount !== "number" || amount <= 0) {
      throw createHttpError(400, "amount must be a positive number");
    }

    // The booking always belongs to the authenticated caller — never trust a
    // client-supplied user id.
    return BookingModel.create({
      user: userId,
      movieTitle,
      moviePoster,
      city,
      theaterName,
      showTime,
      showDate,
      seatType,
      seats,
      ticketCount,
      amount,
    });
  },

  async getBookingsForUser(effectiveUserId: string): Promise<IBooking[]> {
    return BookingModel.find({ user: effectiveUserId }).sort({ createdAt: -1 }).lean<IBooking[]>();
  },

  async getAllBookings(): Promise<IBooking[]> {
    return BookingModel.find().sort({ createdAt: -1 }).lean<IBooking[]>();
  },
};
