import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { seedService } from "./seed.service";

export const seedController = {
  seed: catchAsync(async (_req: Request, res: Response) => {
    await seedService.seedDemoData();
    res.json({ success: true });
  }),
};
