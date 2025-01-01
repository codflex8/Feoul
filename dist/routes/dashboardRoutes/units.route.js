"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const units_controller_1 = require("../../controllers/dashboard/units.controller");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const UnitValidator_1 = __importStar(require("../../utils/validators/UnitValidator"));
const uploadFiles_1 = require("../../middleware/uploadFiles");
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const enums_1 = require("../../utils/types/enums");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// Get all units
router.get("/", (0, express_async_handler_1.default)(units_controller_1.UnitController.getUnits));
// Get a single unit by ID
router.get("/:id", (0, express_async_handler_1.default)(units_controller_1.UnitController.getUnitById));
// Create a new unit
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.default), (0, express_async_handler_1.default)(units_controller_1.UnitController.createUnit));
router.post("/:id/reserve", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(UnitValidator_1.reverseUnitValidator), units_controller_1.UnitController.reserveUnit);
// Update an existing unit
router.put("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), uploadFiles_1.upload.single("video"), (0, validationMiddleware_1.validateData)(UnitValidator_1.default), (0, express_async_handler_1.default)(units_controller_1.UnitController.updateUnit));
// Delete a unit
router.delete("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(units_controller_1.UnitController.deleteUnit));
exports.default = router;
