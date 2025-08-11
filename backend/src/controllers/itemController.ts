import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export async function listItems(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string;
  const items = await prisma.item.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
  return res.json(items);
}

export async function createItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string;
  const { title, description } = itemSchema.parse(req.body);
  const item = await prisma.item.create({ data: { title, description, ownerId: userId } });
  return res.status(201).json(item);
}

export async function updateItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string;
  const id = req.params.id;
  const { title, description } = itemSchema.partial().parse(req.body);
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) return res.status(404).json({ message: "Not found" });
  const item = await prisma.item.update({ where: { id }, data: { title, description } });
  return res.json(item);
}

export async function deleteItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId as string;
  const id = req.params.id;
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) return res.status(404).json({ message: "Not found" });
  await prisma.item.delete({ where: { id } });
  return res.status(204).send();
}