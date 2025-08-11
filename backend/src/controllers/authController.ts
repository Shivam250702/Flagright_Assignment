import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { loginUser, registerUser, logoutUser } from "../services/authService.js";
import { rotateRefreshToken } from "../services/tokenService.js";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const user = await registerUser(name, email, password);
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err: any) {
    const message = err?.message || "Registration failed";
    return res.status(400).json({ message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken, refreshTokenExpiresAt } = await loginUser(email, password);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.cookieSecure,
      expires: refreshTokenExpiresAt,
      path: "/api/auth",
    });
    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    return res.status(401).json({ message: err?.message || "Invalid credentials" });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const oldToken = req.cookies?.refreshToken as string | undefined;
    if (!oldToken) return res.status(401).json({ message: "Missing refresh token" });
    const { accessToken, refreshToken, refreshTokenExpiresAt } = await rotateRefreshToken(oldToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.cookieSecure,
      expires: refreshTokenExpiresAt,
      path: "/api/auth",
    });
    return res.json({ accessToken });
  } catch (err: any) {
    return res.status(401).json({ message: err?.message || "Invalid refresh token" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const auth = req.headers["authorization"];
    let userId: string | null = null;
    if (auth && typeof auth === "string" && auth.startsWith("Bearer ")) {
      try {
        const payload = jwt.verify(auth.split(" ")[1], config.jwtAccessSecret) as { sub: string };
        userId = payload.sub;
      } catch {}
    }
    if (userId) {
      await logoutUser(userId);
    }
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Logout failed" });
  }
}