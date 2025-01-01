"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectFacilities_controller_1 = require("../../controllers/public/projectFacilities.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(projectFacilities_controller_1.PublicFacilitiesController.getProjectFacilitiess));
router.get("/:id", (0, express_async_handler_1.default)(projectFacilities_controller_1.PublicFacilitiesController.getProjectFacilitiesById));
exports.default = router;
