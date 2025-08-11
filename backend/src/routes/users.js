"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var express_1 = require("express");
var auth_js_1 = require("../middleware/auth.js");
var userController_js_1 = require("../controllers/userController.js");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/me", auth_js_1.requireAuth, userController_js_1.me);
