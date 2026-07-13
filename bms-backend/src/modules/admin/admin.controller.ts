import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";

export const adminController = {
  getStats: catchAsync(async (_req: Request, res: Response) => {
    const stats = await adminService.getStats();
    res.json(stats);
  }),

  getAllUsers: catchAsync(async (_req: Request, res: Response) => {
    const users = await adminService.getAllUsers();
    res.json(users);
  }),

  getAllBookings: catchAsync(async (_req: Request, res: Response) => {
    const bookings = await adminService.getAllBookings();
    res.json(bookings);
  }),
};
