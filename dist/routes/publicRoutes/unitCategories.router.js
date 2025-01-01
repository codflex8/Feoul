"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const unitCategory_controller_1 = require("../../controllers/public/unitCategory.controller");
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(unitCategory_controller_1.PublicUnitCategory.getUnitCategories));
router.get("/:id", (0, express_async_handler_1.default)(unitCategory_controller_1.PublicUnitCategory.getUnitCategoryById));
exports.default = router;
