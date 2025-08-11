import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateRandomToken(bytes: number = 48): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export async function hashToken(token: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

export async function verifyTokenHash(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}


