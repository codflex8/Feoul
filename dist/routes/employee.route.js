"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const uploadFiles_1 = require("../middleware/uploadFiles");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const EmployeeValidator_1 = require("../utils/validators/EmployeeValidator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const empolyeeRouter = (0, express_1.Router)();
empolyeeRouter.post("/", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(EmployeeValidator_1.addEmpolyeeValidator), (0, express_async_handler_1.default)(employee_controller_1.EmployeeController.addEmployee));
empolyeeRouter.get("/", (0, express_async_handler_1.default)(employee_controller_1.EmployeeController.getEmployees));
empolyeeRouter.delete("/:id", (0, express_async_handler_1.default)(employee_controller_1.EmployeeController.deleteEmployee));
exports.default = empolyeeRouter;
