"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = void 0;
const auth_route_1 = __importDefault(require("./auth.route"));
const setRoutes = (app) => {
    app.use("/api/v1/auth", auth_route_1.default);
};
exports.setRoutes = setRoutes;
