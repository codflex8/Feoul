"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const User_model_1 = require("../entities/User.model");
const typeorm_1 = require("typeorm");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const enums_1 = require("../utils/types/enums");
class EmployeeService {
    static async createEmployee(data, translate) {
        const isUserExist = await User_model_1.User.findOne({
            where: { username: (0, typeorm_1.Equal)(data.username) },
        });
        if (isUserExist) {
            throw new ApiError_1.default(translate("this_employee_signed_up_already"), 409);
        }
        const cryptedPassword = await (0, bcryptPassword_1.default)(data.password);
        const user = User_model_1.User.create({
            username: data.username,
            password: cryptedPassword,
            imageUrl: data.image,
            role: data.role,
        });
        await user.save();
        return user;
    }
    static async getEmployees() {
        return await User_model_1.User.find();
    }
    static async deleteEmployee(id, translate) {
        const employee = await User_model_1.User.findOne({
            where: { id, role: enums_1.UsersRoles.Employee },
        });
        if (!employee) {
            throw new ApiError_1.default(translate("employee_not_found"), 404);
        }
        await employee.softRemove();
        return employee;
    }
}
exports.EmployeeService = EmployeeService;
