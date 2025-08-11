import crypto from "crypto";
import bcrypt from "bcryptjs";
export function generateRandomToken(bytes = 48) {
    return crypto.randomBytes(bytes).toString("hex");
}
export async function hashToken(token) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
}
export async function verifyTokenHash(token, hash) {
    return bcrypt.compare(token, hash);
}
