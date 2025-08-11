"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
var zod_1 = require("zod");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_js_1 = require("../config.js");
var authService_js_1 = require("../services/authService.js");
var tokenService_js_1 = require("../services/tokenService.js");
var registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
var loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
function register(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, email, password, user, err_1, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = registerSchema.parse(req.body), name_1 = _a.name, email = _a.email, password = _a.password;
                    return [4 /*yield*/, (0, authService_js_1.registerUser)(name_1, email, password)];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, res.status(201).json({ id: user.id, email: user.email, name: user.name })];
                case 2:
                    err_1 = _b.sent();
                    message = (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || "Registration failed";
                    return [2 /*return*/, res.status(400).json({ message: message })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, _b, user, accessToken, refreshToken, refreshTokenExpiresAt, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = loginSchema.parse(req.body), email = _a.email, password = _a.password;
                    return [4 /*yield*/, (0, authService_js_1.loginUser)(email, password)];
                case 1:
                    _b = _c.sent(), user = _b.user, accessToken = _b.accessToken, refreshToken = _b.refreshToken, refreshTokenExpiresAt = _b.refreshTokenExpiresAt;
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "lax",
                        secure: config_js_1.config.cookieSecure,
                        expires: refreshTokenExpiresAt,
                        path: "/api/auth",
                    });
                    return [2 /*return*/, res.json({
                            accessToken: accessToken,
                            user: { id: user.id, email: user.email, name: user.name },
                        })];
                case 2:
                    err_2 = _c.sent();
                    return [2 /*return*/, res.status(401).json({ message: (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || "Invalid credentials" })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var oldToken, _a, accessToken, refreshToken, refreshTokenExpiresAt, err_3;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    oldToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
                    if (!oldToken)
                        return [2 /*return*/, res.status(401).json({ message: "Missing refresh token" })];
                    return [4 /*yield*/, (0, tokenService_js_1.rotateRefreshToken)(oldToken)];
                case 1:
                    _a = _c.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, refreshTokenExpiresAt = _a.refreshTokenExpiresAt;
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "lax",
                        secure: config_js_1.config.cookieSecure,
                        expires: refreshTokenExpiresAt,
                        path: "/api/auth",
                    });
                    return [2 /*return*/, res.json({ accessToken: accessToken })];
                case 2:
                    err_3 = _c.sent();
                    return [2 /*return*/, res.status(401).json({ message: (err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || "Invalid refresh token" })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, userId, payload, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    auth = req.headers["authorization"];
                    userId = null;
                    if (auth && typeof auth === "string" && auth.startsWith("Bearer ")) {
                        try {
                            payload = jsonwebtoken_1.default.verify(auth.split(" ")[1], config_js_1.config.jwtAccessSecret);
                            userId = payload.sub;
                        }
                        catch (_b) { }
                    }
                    if (!userId) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, authService_js_1.logoutUser)(userId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    res.clearCookie("refreshToken", { path: "/api/auth" });
                    return [2 /*return*/, res.status(204).send()];
                case 3:
                    err_4 = _a.sent();
                    return [2 /*return*/, res.status(400).json({ message: (err_4 === null || err_4 === void 0 ? void 0 : err_4.message) || "Logout failed" })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
