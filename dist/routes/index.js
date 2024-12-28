"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = void 0;
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const auth_controller_1 = require("../controllers/dashboard/auth.controller");
const auth_route_1 = __importDefault(require("./dashboardRoutes/auth.route"));
const setRoutes = (app) => {
    app.use("/api/v1/dashboard/auth", auth_route_1.default);
    app.use("/api/v1/dashboard", auth_controller_1.AuthController.protect, dashboardRoutes_1.default);
};
exports.setRoutes = setRoutes;
