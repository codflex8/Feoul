"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const UnitValidator_1 = require("../../utils/validators/UnitValidator");
const uploadFiles_1 = require("../../middleware/uploadFiles");
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const enums_1 = require("../../utils/types/enums");
const unitCategory_controller_1 = require("../../controllers/dashboard/unitCategory.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// Get all units
router.get("/", (0, express_async_handler_1.default)(unitCategory_controller_1.UnitCategoryController.getUnitCategories));
// Get a single unit by ID
router.get("/:id", (0, express_async_handler_1.default)(unitCategory_controller_1.UnitCategoryController.getUnitCategoryById));
// Create a new unit
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitCategoryValidation), (0, express_async_handler_1.default)(unitCategory_controller_1.UnitCategoryController.createUnitCategory));
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitCategoryValidation), (0, express_async_handler_1.default)(unitCategory_controller_1.UnitCategoryController.updateUnitCategory));
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(unitCategory_controller_1.UnitCategoryController.deleteUnitCategory));
exports.default = router;
