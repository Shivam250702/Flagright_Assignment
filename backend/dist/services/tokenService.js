import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../utils/prisma.js";
import { generateRandomToken, hashToken, verifyTokenHash } from "../utils/crypto.js";
/**
 * A simple helper to convert time strings like "7d" or "15m" to milliseconds.
 * This removes the need for the 'ms' library, which was causing type errors.
 */
function timeStringToMs(timeStr) {
    const value = parseInt(timeStr.slice(0, -1), 10);
    const unit = timeStr.slice(-1);
    switch (unit) {
        case "s":
            return value * 1000; // seconds
        case "m":
            return value * 60 * 1000; // minutes
        case "h":
            return value * 60 * 60 * 1000; // hours
        case "d":
            return value * 24 * 60 * 60 * 1000; // days
        default:
            throw new Error(`Invalid time string format: ${timeStr}`);
    }
}
function signAccessToken(userId) {
    const payload = { sub: userId };
    // Convert the time string (e.g., "15m") to a number of seconds.
    const expiresInSeconds = timeStringToMs(config.accessTokenTtl) / 1000;
    const options = {
        expiresIn: expiresInSeconds
    };
    return jwt.sign(payload, config.jwtAccessSecret, options);
}
export async function issueTokens(userId) {
    const accessToken = signAccessToken(userId);
    const rawSecret = generateRandomToken(48);
    const tokenHash = await hashToken(rawSecret);
    const expiresInMs = timeStringToMs(config.refreshTokenTtl);
    const expiresAt = new Date(Date.now() + expiresInMs);
    const record = await prisma.refreshToken.create({
        data: {
            tokenHash,
            userId,
            expiresAt,
        },
        select: { id: true, expiresAt: true },
    });
    const compositeRefreshToken = `${record.id}.${rawSecret}`;
    return { accessToken, refreshToken: compositeRefreshToken, refreshTokenExpiresAt: record.expiresAt };
}
export async function rotateRefreshToken(compositeToken) {
    const [tokenId, rawSecret] = compositeToken.split(".");
    if (!tokenId || !rawSecret)
        throw new Error("Malformed refresh token");
    const record = await prisma.refreshToken.findUnique({ where: { id: tokenId } });
    if (!record || record.revoked || record.expiresAt < new Date())
        throw new Error("Invalid refresh token");
    const valid = await verifyTokenHash(rawSecret, record.tokenHash);
    if (!valid)
        throw new Error("Invalid refresh token");
    await prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } });
    return issueTokens(record.userId);
}
export async function revokeAllUserRefreshTokens(userId) {
    await prisma.refreshToken.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
}
