import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";

export const userController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await userService.register(req.body || {});
    res.status(201).json(result);
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await userService.login(req.body || {});
    res.json(result);
  }),

  updateUser: catchAsync(async (req: Request, res: Response) => {
    const result = await userService.updateUser(String(req.params.id), req.body || {});
    res.json(result);
  }),
};
