import { NextFunction, Request, Response } from "express";
import { EmployeeService } from "../../services/employee.service";

export class EmployeeController {
  public static async addEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await EmployeeService.createEmployee(req.body, req.t);
      res.status(201).json({
        message: req.t("add_employee_success"),
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getEmployees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employees = await EmployeeService.getEmployees();
      res.status(200).json({ employees });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await EmployeeService.deleteEmployee(req.params.id, req.t);
      res.status(200).json({
        message: req.t("delete_employee_success"),
      });
    } catch (error) {
      next(error);
    }
  }
}
