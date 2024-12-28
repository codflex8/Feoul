"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MapLocations_controller_1 = require("../../controllers/dashboard/MapLocations.controller");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const MapLocation_1 = require("../../utils/validators/MapLocation");
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const enums_1 = require("../../utils/types/enums");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(MapLocations_controller_1.MapLocationController.getMapLocations));
router.get("/:id", (0, express_async_handler_1.default)(MapLocations_controller_1.MapLocationController.getMapLocationById));
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(MapLocation_1.MapLocationValidator), (0, express_async_handler_1.default)(MapLocations_controller_1.MapLocationController.createMapLocation));
router.put("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(MapLocation_1.MapLocationValidator), (0, express_async_handler_1.default)(MapLocations_controller_1.MapLocationController.updateMapLocation));
router.delete("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(MapLocations_controller_1.MapLocationController.deleteMapLocation));
exports.default = router;
