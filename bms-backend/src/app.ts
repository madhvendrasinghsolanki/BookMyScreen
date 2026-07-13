import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import routes from "./routes";
import { config } from "./config/config";

dotenv.config();

const app = express();

// Support one or more comma-separated origins via FRONTEND_URL, and always
// allow localhost:5173 for local development.
const allowedOrigins = Array.from(
  new Set([
    ...config.frontendUrl.split(",").map((origin) => origin.trim()).filter(Boolean),
    "http://localhost:5173",
  ])
);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(routes);

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

connectDatabase();

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to BookMyScreen API",
  });
});

// Global error handler (MUST be after all routes)
app.use((err: Error & { status?: number; statusCode?: number; expose?: boolean }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const isCorsError = /not allowed by CORS/.test(err.message);
  if (isCorsError) {
    return res.status(403).json({ message: "Origin not allowed" });
  }

  // http-errors sets statusCode/status + expose (true for 4xx, false for 5xx)
  // so client-facing validation/auth messages come through, while unexpected
  // 5xx errors still fall back to a generic message instead of leaking internals.
  const status = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : "Something went wrong";
  res.status(status).json({ message });
});

export default app;
