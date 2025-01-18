"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const unitIntreset_controller_1 = require("../../controllers/public/unitIntreset.controller");
const router = (0, express_1.Router)();
router.post("/", (0, express_async_handler_1.default)(unitIntreset_controller_1.PublicUnitIntresets.createUnitIntresert));
exports.default = router;
