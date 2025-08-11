import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { me } from "../controllers/userController.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, me);