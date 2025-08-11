import jwt from "jsonwebtoken";
import { config } from "../config.js";
export function requireAuth(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || Array.isArray(authHeader)) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }
    try {
        const payload = jwt.verify(token, config.jwtAccessSecret);
        req.user = { userId: payload.sub };
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}
