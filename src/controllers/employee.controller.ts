import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User.model";
import { Equal } from "typeorm";
import ApiError from "../utils/ApiError";
import bcryptPassword from "../utils/bcryptPassword";
import { UsersRoles } from "../utils/types/enums";

export class EmployeeController {
  public static async addEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { username, password, image, role } = req.body;
    const isUserExist = await User.findOne({
      where: {
        username: Equal(req.body.username),
      },
    });
    if (isUserExist) {
      return next(new ApiError(req.t("this_employee_signed_up_already"), 409));
    }
    // 1- Create user
    const cryptedPassword = await bcryptPassword(password);
    const user = await User.create({
      username,
      password: cryptedPassword,
      imageUrl: image,
      role,
    });
    await user.save();

    res.status(201).json({ message: req.t("add_employee_success"), user });
  }

  public static async getEmployees(req: Request, res: Response) {
    const employees = await User.find({
      where: { role: UsersRoles.Employee },
      select: ["id", "username", "imageUrl"],
    });
    res.status(200).json({ employees });
  }

  public static async deleteEmployee(req: Request, res: Response) {
    const { id } = req.params;
    const employee = await User.findOne({
      where: { id, role: UsersRoles.Employee },
    });
    if (!employee) {
      throw new ApiError(req.t("employee_not_found"), 404);
    }
    await employee.softRemove();
    res.status(200).json({ message: req.t("delete_employee_success") });
  }
}
