"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const units_controller_1 = require("../../controllers/public/units.controller");
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(units_controller_1.PublicUnitController.getUnits));
router.get("/:id", (0, express_async_handler_1.default)(units_controller_1.PublicUnitController.getUnitById));
router.get("/:id/floors", (0, express_async_handler_1.default)(units_controller_1.PublicUnitController.getUnitFloors));
exports.default = router;
