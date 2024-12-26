"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const User_model_1 = require("../entities/User.model");
const typeorm_1 = require("typeorm");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const enums_1 = require("../utils/types/enums");
class EmployeeController {
    static async addEmployee(req, res, next) {
        const { username, password, image, role } = req.body;
        const isUserExist = await User_model_1.User.findOne({
            where: {
                username: (0, typeorm_1.Equal)(req.body.username),
            },
        });
        if (isUserExist) {
            return next(new ApiError_1.default(req.t("this_employee_signed_up_already"), 409));
        }
        // 1- Create user
        const cryptedPassword = await (0, bcryptPassword_1.default)(password);
        const user = await User_model_1.User.create({
            username,
            password: cryptedPassword,
            imageUrl: image,
            role,
        });
        await user.save();
        res.status(201).json({ message: req.t("add_employee_success"), user });
    }
    static async getEmployees(req, res) {
        const employees = await User_model_1.User.find({
            where: { role: enums_1.UsersRoles.Employee },
            select: ["id", "username", "imageUrl"],
        });
        res.status(200).json({ employees });
    }
    static async deleteEmployee(req, res) {
        const { id } = req.params;
        const employee = await User_model_1.User.findOne({
            where: { id, role: enums_1.UsersRoles.Employee },
        });
        if (!employee) {
            throw new ApiError_1.default(req.t("employee_not_found"), 404);
        }
        await employee.softRemove();
        res.status(200).json({ message: req.t("delete_employee_success") });
    }
}
exports.EmployeeController = EmployeeController;
