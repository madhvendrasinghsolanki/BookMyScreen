import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";

export const bookingController = {
  createBooking: catchAsync(async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking(req.auth!.sub, req.body || {});
    res.status(201).json(booking);
  }),

  getBookings: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.query;
    // Non-admins can only ever see their own bookings, regardless of what
    // userId they pass.
    const effectiveUserId = req.auth!.role === "admin" ? String(userId || req.auth!.sub) : req.auth!.sub;
    const bookings = await bookingService.getBookingsForUser(effectiveUserId);
    res.json(bookings);
  }),
};
