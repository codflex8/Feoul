"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitFloor_controller_1 = require("../controllers/unitFloor.controller");
const enums_1 = require("../utils/types/enums");
const auth_controller_1 = require("../controllers/auth.controller");
const uploadFiles_1 = require("../middleware/uploadFiles");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const router = (0, express_1.Router)();
// Get all units
router.get("/", unitFloor_controller_1.UnitFloorController.getUnitFloor);
// Get a single unit by ID
router.get("/:id", unitFloor_controller_1.UnitFloorController.getUnitFloorById);
// Create a new unit
router.post("/", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitFloorValidation), unitFloor_controller_1.UnitFloorController.createUnitFloor);
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitFloorValidation), unitFloor_controller_1.UnitFloorController.updateUnitFloor);
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), unitFloor_controller_1.UnitFloorController.deleteUnitFloor);
exports.default = router;
