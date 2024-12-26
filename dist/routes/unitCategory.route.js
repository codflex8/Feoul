"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const uploadFiles_1 = require("../middleware/uploadFiles");
const auth_controller_1 = require("../controllers/auth.controller");
const enums_1 = require("../utils/types/enums");
const unitCategory_controller_1 = require("../controllers/unitCategory.controller");
const router = (0, express_1.Router)();
// Get all units
router.get("/", unitCategory_controller_1.UnitCategoryController.getUnitCategories);
// Get a single unit by ID
router.get("/:id", unitCategory_controller_1.UnitCategoryController.getUnitCategoryById);
// Create a new unit
router.post("/", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitCategoryValidation), unitCategory_controller_1.UnitCategoryController.createUnitCategory);
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitCategoryValidation), unitCategory_controller_1.UnitCategoryController.updateUnitCategory);
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), unitCategory_controller_1.UnitCategoryController.deleteUnitCategory);
exports.default = router;
