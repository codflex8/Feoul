import { User } from "../entities/User.model";
import { Equal } from "typeorm";
import { TFunction } from "i18next";
import ApiError from "../utils/ApiError";
import bcryptPassword from "../utils/bcryptPassword";
import { UsersRoles } from "../utils/types/enums";

interface CreateEmployeeData {
  username: string;
  password: string;
  image?: string;
  role: UsersRoles;
}

export class EmployeeService {
  static async createEmployee(data: CreateEmployeeData, translate: TFunction) {
    const isUserExist = await User.findOne({
      where: { username: Equal(data.username) },
    });

    if (isUserExist) {
      throw new ApiError(translate("this_employee_signed_up_already"), 409);
    }

    const cryptedPassword = await bcryptPassword(data.password);
    const user = User.create({
      username: data.username,
      password: cryptedPassword,
      imageUrl: data.image,
      role: data.role,
    });

    await user.save();
    return user;
  }

  static async getEmployees() {
    return await User.find();
  }

  static async deleteEmployee(id: string, translate: TFunction) {
    const employee = await User.findOne({
      where: { id, role: UsersRoles.Employee },
    });

    if (!employee) {
      throw new ApiError(translate("employee_not_found"), 404);
    }

    await employee.softRemove();
    return employee;
  }
}
