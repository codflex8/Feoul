"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const AuthValidator_1 = require("../utils/validators/AuthValidator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authRouter = (0, express_1.Router)();
authRouter.post("/signin", (0, validationMiddleware_1.validateData)(AuthValidator_1.signInValidator), (0, express_async_handler_1.default)(auth_controller_1.AuthController.signIn));
authRouter.post("/admin", (0, express_async_handler_1.default)(auth_controller_1.AuthController.addAdmin));
authRouter.post("/signout", auth_controller_1.AuthController.protect, (0, express_async_handler_1.default)(auth_controller_1.AuthController.signOut));
// authRouter.post("/refreshToken", AuthController.refreshToken);
exports.default = authRouter;
