import dotenv from "dotenv";

dotenv.config();

const required = (name: string, fallback?: string) => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[config] Missing required env var "${name}" — using an insecure default. Set it in .env before deploying.`);
  }
  return value || "";
};

export const config = {
  databaseUrl: (() => {
    const databaseUrl =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.MONGO_CONNECTION_STRING ||
      "";

    if (!databaseUrl && process.env.NODE_ENV === "production") {
      throw new Error("Missing database connection string. Set MONGODB_URI in production.");
    }

    return databaseUrl || "mongodb://127.0.0.1:27017/bookmyscreen";
  })(),
  port: Number(process.env.PORT || 9000),
  // No hardcoded fallback key — must be supplied via .env. Requests will
  // fail fast with a clear error instead of silently using a shared demo key.
  omdbApiKey: process.env.OMDB_API_KEY || "",
  jwtSecret: required("ACCESS_TOKEN_SECRET", process.env.JWT_SECRET || "dev-secret-change-in-production"),
  // Comma-separated list of allowed origins, e.g. "https://app.example.com,https://admin.example.com"
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  debugErrors: String(process.env.DEBUG_ERRORS || "").toLowerCase() === "true",
};
