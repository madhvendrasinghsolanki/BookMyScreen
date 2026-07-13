import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { showService } from "./show.service";

export const showController = {
  getShows: catchAsync(async (req: Request, res: Response) => {
    const { movieId, city } = req.query;
    const shows = await showService.getShows({
      movieId: typeof movieId === "string" ? movieId : undefined,
      city: typeof city === "string" ? city : undefined,
    });
    res.json(shows);
  }),

  createShow: catchAsync(async (req: Request, res: Response) => {
    const show = await showService.createShow(req.body || {});
    res.status(201).json(show);
  }),
};
