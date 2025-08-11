import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export const securityMiddleware = {
  helmet: helmet(),
  cors: cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
};