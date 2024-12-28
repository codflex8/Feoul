"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const auth_controller_1 = require("../controllers/auth.controller");
const enums_1 = require("../utils/types/enums");
const projectFacilities_controller_1 = require("../controllers/projectFacilities.controller");
const ProjectValidator_1 = require("../utils/validators/ProjectValidator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(projectFacilities_controller_1.ProjectFacilitiesController.getProjectFacilitiess));
router.get("/:id", (0, express_async_handler_1.default)(projectFacilities_controller_1.ProjectFacilitiesController.getProjectFacilitiesById));
router.post("/", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(ProjectValidator_1.projectFacilitesValidator), projectFacilities_controller_1.ProjectFacilitiesController.createProjectFacilities);
router.put("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(ProjectValidator_1.projectFacilitesValidator), (0, express_async_handler_1.default)(projectFacilities_controller_1.ProjectFacilitiesController.updateProjectFacilities));
router.delete("/:id", auth_controller_1.AuthController.protect, auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(projectFacilities_controller_1.ProjectFacilitiesController.deleteProjectFacilities));
exports.default = router;
