import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { movieService } from "./movie.service";

export const movieController = {
  getAllMovies: catchAsync(async (_req: Request, res: Response) => {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  }),

  createMovie: catchAsync(async (req: Request, res: Response) => {
    const movie = await movieService.createMovie(req.body || {});
    res.status(201).json(movie);
  }),

  searchLive: catchAsync(async (req: Request, res: Response) => {
    const results = await movieService.searchLive(req.query.query);
    res.json({ results });
  }),

  getLiveById: catchAsync(async (req: Request, res: Response) => {
    const movie = await movieService.getLiveById(String(req.params.imdbId));
    res.json(movie);
  }),
};
