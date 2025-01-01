"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../../controllers/public/project.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get("/", (0, express_async_handler_1.default)(project_controller_1.PublicProjectController.getProjects));
router.get("/:id", (0, express_async_handler_1.default)(project_controller_1.PublicProjectController.getProjectById));
exports.default = router;
