"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_js_1 = require("../config.js");
function requireAuth(req, res, next) {
    var authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || Array.isArray(authHeader)) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }
    var _a = authHeader.split(" "), scheme = _a[0], token = _a[1];
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }
    try {
        var payload = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtAccessSecret);
        req.user = { userId: payload.sub };
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}
