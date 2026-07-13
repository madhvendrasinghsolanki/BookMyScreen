import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async Express handler so any rejected promise (or thrown error)
 * is forwarded to `next(error)` instead of crashing the process or being
 * silently swallowed. Lets controllers be written as plain `async` functions.
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
