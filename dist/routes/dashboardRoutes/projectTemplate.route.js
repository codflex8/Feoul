"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const enums_1 = require("../../utils/types/enums");
const projectTemplate_controller_1 = require("../../controllers/dashboard/projectTemplate.controller");
const ProjectTemplateValidator_1 = __importDefault(require("../../utils/validators/ProjectTemplateValidator"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(projectTemplate_controller_1.ProjectTemplateController.getProjectTemplates));
router.get("/:id", (0, express_async_handler_1.default)(projectTemplate_controller_1.ProjectTemplateController.getProjectTemplateById));
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(ProjectTemplateValidator_1.default), (0, express_async_handler_1.default)(projectTemplate_controller_1.ProjectTemplateController.createProjectTemplate));
router.put("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, validationMiddleware_1.validateData)(ProjectTemplateValidator_1.default), (0, express_async_handler_1.default)(projectTemplate_controller_1.ProjectTemplateController.updateProjectTemplate));
router.delete("/:id", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), (0, express_async_handler_1.default)(projectTemplate_controller_1.ProjectTemplateController.deleteProjectTemplate));
exports.default = router;
