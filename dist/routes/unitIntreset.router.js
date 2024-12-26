"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enums_1 = require("../utils/types/enums");
const auth_controller_1 = require("../controllers/auth.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const unitIntreset_controller_1 = require("../controllers/unitIntreset.controller");
const router = (0, express_1.Router)();
// Get all units
router.get("/", auth_controller_1.AuthController.protect, unitIntreset_controller_1.UnitIntresetController.getUnitIntreset);
// Get a single unit by ID
router.get("/:id", auth_controller_1.AuthController.protect, unitIntreset_controller_1.UnitIntresetController.getUnitIntresetById);
// Create a new unit
router.post("/", (0, validationMiddleware_1.validateData)(UnitValidator_1.unitIntresetValidation), unitIntreset_controller_1.UnitIntresetController.createUnitIntreset);
// Update an existing unit
router.put("/:id", (0, validationMiddleware_1.validateData)(UnitValidator_1.unitIntresetValidation), unitIntreset_controller_1.UnitIntresetController.updateUnitIntreset);
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), unitIntreset_controller_1.UnitIntresetController.deleteUnitIntreset);
exports.default = router;
