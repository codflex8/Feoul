"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const units_controller_1 = require("../controllers/units.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UnitValidator_1 = __importDefault(require("../utils/validators/UnitValidator"));
const uploadFiles_1 = require("../middleware/uploadFiles");
const auth_controller_1 = require("../controllers/auth.controller");
const enums_1 = require("../utils/types/enums");
const router = (0, express_1.Router)();
// Get all units
router.get("/", units_controller_1.UnitController.getUnits);
// Get a single unit by ID
router.get("/:id", units_controller_1.UnitController.getUnitById);
// Create a new unit
router.post("/", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.default), units_controller_1.UnitController.createUnit);
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.default), units_controller_1.UnitController.updateUnit);
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), units_controller_1.UnitController.deleteUnit);
exports.default = router;
