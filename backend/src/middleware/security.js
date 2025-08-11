"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
var helmet_1 = require("helmet");
var cors_1 = require("cors");
var express_rate_limit_1 = require("express-rate-limit");
var config_js_1 = require("../config.js");
exports.securityMiddleware = {
    helmet: (0, helmet_1.default)(),
    cors: (0, cors_1.default)({
        origin: config_js_1.config.corsOrigin,
        credentials: true,
    }),
    rateLimiter: (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
    }),
};
