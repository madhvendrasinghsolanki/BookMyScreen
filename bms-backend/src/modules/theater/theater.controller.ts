import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { theaterService } from "./theater.service";

export const theaterController = {
  getAllTheaters: catchAsync(async (_req: Request, res: Response) => {
    const theaters = await theaterService.getAllTheaters();
    res.json(theaters);
  }),

  createTheater: catchAsync(async (req: Request, res: Response) => {
    const theater = await theaterService.createTheater(req.body || {});
    res.status(201).json(theater);
  }),
};
