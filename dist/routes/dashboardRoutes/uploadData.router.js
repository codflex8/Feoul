"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadData_controller_1 = require("../../controllers/dashboard/uploadData.controller");
const multer_1 = __importDefault(require("multer"));
const auth_controller_1 = require("../../controllers/dashboard/auth.controller");
const enums_1 = require("../../utils/types/enums");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/", auth_controller_1.AuthController.allowedto([enums_1.UsersRoles.Admin]), upload.single("file"), uploadData_controller_1.UploadData.uploadData);
exports.default = router;
