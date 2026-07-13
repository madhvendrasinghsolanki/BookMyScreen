import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthPayload {
  sub: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

/**
 * Verifies the Bearer token on the Authorization header and attaches the
 * decoded payload to req.auth. Rejects the request with 401 if the token
 * is missing, malformed, or invalid/expired.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.auth = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Must run after `authenticate`. Rejects with 403 unless the caller's
 * role is "admin".
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

/**
 * Must run after `authenticate`. Allows the request through if the caller
 * is an admin, or if the caller's id matches the `:id` / `userId` value
 * being acted upon. Otherwise rejects with 403.
 */
export const requireSelfOrAdmin = (paramName = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const targetId = req.params[paramName] || (req.query.userId as string) || req.body?.user;
    if (req.auth.role === "admin" || req.auth.sub === String(targetId)) {
      return next();
    }
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  };
};
