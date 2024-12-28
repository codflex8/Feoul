"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enums_1 = require("../utils/types/enums");
const auth_controller_1 = require("../controllers/auth.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const unitIntreset_controller_1 = require("../controllers/unitIntreset.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// Get all units
router.get("/", auth_controller_1.AuthController.protect, (0, express_async_handler_1.default)(unitIntreset_controller_1.UnitIntresetController.getUnitIntreset));
// Get a single unit by ID
router.get("/:id", auth_controller_1.AuthController.protect, (0, express_async_handler_1.default)(unitIntreset_controller_1.UnitIntresetController.getUnitIntresetById));
// Create a new unit
router.post("/", (0, validationMiddleware_1.validateData)(UnitValidator_1.unitIntresetValidation), (0, express_async_handler_1.default)(unitIntreset_controller_1.UnitIntresetController.createUnitIntreset));
// Update an existing unit
router.put("/:id", (0, validationMiddleware_1.validateData)(UnitValidator_1.unitIntresetValidation), (0, express_async_handler_1.default)(unitIntreset_controller_1.UnitIntresetController.updateUnitIntreset));
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(unitIntreset_controller_1.UnitIntresetController.deleteUnitIntreset));
exports.default = router;
