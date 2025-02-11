"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitFloor_controller_1 = require("../../controllers/dashboard/unitFloor.controller");
const enums_1 = require("../../utils/types/enums");
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const uploadFiles_1 = require("../../middleware/uploadFiles");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const UnitValidator_1 = require("../../utils/validators/UnitValidator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// Get all units
router.get("/", (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.getUnitFloor));
// Get a single unit by ID
router.get("/:id", (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.getUnitFloorById));
// Create a new unit
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitFloorValidation), (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.createUnitFloor));
router.put("/categories-floors", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitCategoryFloorUpdate), (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.updateUnitCategoryFloors));
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(UnitValidator_1.unitFloorValidation), (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.updateUnitFloor));
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(unitFloor_controller_1.UnitFloorController.deleteUnitFloor));
exports.default = router;
