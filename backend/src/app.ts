import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { securityMiddleware } from "./middleware/security.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(securityMiddleware.helmet);
app.use(securityMiddleware.cors);
app.use(securityMiddleware.rateLimiter);
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", apiRouter);