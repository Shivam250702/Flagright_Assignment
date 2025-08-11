import dotenv from "dotenv";
dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(getEnv("PORT", "4000"), 10),
  databaseUrl: getEnv("DATABASE_URL"),
  frontendUrl: getEnv("FRONTEND_URL", "http://localhost:5173"),
  corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
  jwtAccessSecret: getEnv("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET"),
  accessTokenTtl: getEnv("ACCESS_TOKEN_TTL", "15m"),
  refreshTokenTtl: getEnv("REFRESH_TOKEN_TTL", "7d"),
  cookieSecure: getEnv("COOKIE_SECURE", "false") === "true",
};


