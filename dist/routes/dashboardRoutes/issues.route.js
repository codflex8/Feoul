"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issues_controller_1 = require("../../controllers/dashboard/issues.controller");
const router = (0, express_1.Router)();
router.get("/", issues_controller_1.IssuesController.getIssues);
exports.default = router;
