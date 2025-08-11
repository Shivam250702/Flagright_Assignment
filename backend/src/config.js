"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
function getEnv(name, fallback) {
    var _a;
    var value = (_a = process.env[name]) !== null && _a !== void 0 ? _a : fallback;
    if (value === undefined) {
        throw new Error("Missing required environment variable: ".concat(name));
    }
    return value;
}
exports.config = {
    nodeEnv: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development",
    port: parseInt(getEnv("PORT", "4000"), 10),
    databaseUrl: getEnv("DATABASE_URL"),
    frontendUrl: getEnv("FRONTEND_URL", "http://localhost:5173"),
    corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
    jwtAccessSecret: getEnv("JWT_ACCESS_SECRET"),
    jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET"),
    accessTokenTtl: getEnv("ACCESS_TOKEN_TTL", "15m"),
    refreshTokenTtl: getEnv("REFRESH_TOKEN_TTL", "7d"),
    cookieSecure: getEnv("COOKIE_SECURE", "false") === "true",
};
