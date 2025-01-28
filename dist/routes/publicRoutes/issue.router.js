"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const IssueValidator_1 = require("../../utils/validators/IssueValidator");
const issues_controller_1 = require("../../controllers/public/issues.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.post("/", (0, validationMiddleware_1.validateData)(IssueValidator_1.issueValidator), (0, express_async_handler_1.default)(issues_controller_1.PublicIssuesController.createIssue));
exports.default = router;
