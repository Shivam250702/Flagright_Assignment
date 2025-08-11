import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createItem, deleteItem, listItems, updateItem } from "../controllers/itemController.js";
export const itemsRouter = Router();
itemsRouter.get("/", requireAuth, listItems);
itemsRouter.post("/", requireAuth, createItem);
itemsRouter.put("/:id", requireAuth, updateItem);
itemsRouter.delete("/:id", requireAuth, deleteItem);
