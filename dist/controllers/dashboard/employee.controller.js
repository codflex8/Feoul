"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const employee_service_1 = require("../../services/employee.service");
class EmployeeController {
    static async addEmployee(req, res, next) {
        try {
            const user = await employee_service_1.EmployeeService.createEmployee(req.body, req.t);
            res.status(201).json({
                message: req.t("add_employee_success"),
                user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getEmployees(req, res, next) {
        try {
            const employees = await employee_service_1.EmployeeService.getEmployees();
            res.status(200).json({ employees });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteEmployee(req, res, next) {
        try {
            await employee_service_1.EmployeeService.deleteEmployee(req.params.id, req.t);
            res.status(200).json({
                message: req.t("delete_employee_success"),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EmployeeController = EmployeeController;
