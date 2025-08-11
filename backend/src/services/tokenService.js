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
exports.issueTokens = issueTokens;
exports.rotateRefreshToken = rotateRefreshToken;
exports.revokeAllUserRefreshTokens = revokeAllUserRefreshTokens;
var jsonwebtoken_1 = require("jsonwebtoken");
var ms_1 = require("ms");
var config_js_1 = require("../config.js");
var prisma_js_1 = require("../utils/prisma.js");
var crypto_js_1 = require("../utils/crypto.js");
function signAccessToken(userId) {
    return jsonwebtoken_1.default.sign({}, config_js_1.config.jwtAccessSecret, {
        subject: userId,
        expiresIn: config_js_1.config.accessTokenTtl,
    });
}
function issueTokens(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, rawSecret, tokenHash, expiresAt, record, compositeRefreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accessToken = signAccessToken(userId);
                    rawSecret = (0, crypto_js_1.generateRandomToken)(48);
                    return [4 /*yield*/, (0, crypto_js_1.hashToken)(rawSecret)];
                case 1:
                    tokenHash = _a.sent();
                    expiresAt = new Date(Date.now() + (0, ms_1.default)(config_js_1.config.refreshTokenTtl));
                    return [4 /*yield*/, prisma_js_1.prisma.refreshToken.create({
                            data: {
                                tokenHash: tokenHash,
                                userId: userId,
                                expiresAt: expiresAt,
                            },
                            select: { id: true, expiresAt: true },
                        })];
                case 2:
                    record = _a.sent();
                    compositeRefreshToken = "".concat(record.id, ".").concat(rawSecret);
                    return [2 /*return*/, { accessToken: accessToken, refreshToken: compositeRefreshToken, refreshTokenExpiresAt: record.expiresAt }];
            }
        });
    });
}
function rotateRefreshToken(compositeToken) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, tokenId, rawSecret, record, valid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = compositeToken.split("."), tokenId = _a[0], rawSecret = _a[1];
                    if (!tokenId || !rawSecret)
                        throw new Error("Malformed refresh token");
                    return [4 /*yield*/, prisma_js_1.prisma.refreshToken.findUnique({ where: { id: tokenId } })];
                case 1:
                    record = _b.sent();
                    if (!record || record.revoked || record.expiresAt < new Date())
                        throw new Error("Invalid refresh token");
                    return [4 /*yield*/, (0, crypto_js_1.verifyTokenHash)(rawSecret, record.tokenHash)];
                case 2:
                    valid = _b.sent();
                    if (!valid)
                        throw new Error("Invalid refresh token");
                    return [4 /*yield*/, prisma_js_1.prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, issueTokens(record.userId)];
            }
        });
    });
}
function revokeAllUserRefreshTokens(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_js_1.prisma.refreshToken.updateMany({ where: { userId: userId, revoked: false }, data: { revoked: true } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
