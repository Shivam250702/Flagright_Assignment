import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import { issueTokens, revokeAllUserRefreshTokens } from "./tokenService.js";

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");
  const tokens = await issueTokens(user.id);
  return { user, ...tokens };
}

export async function logoutUser(userId: string) {
  await revokeAllUserRefreshTokens(userId);
}