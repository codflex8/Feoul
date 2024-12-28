import { Request, Response, NextFunction } from "express";
import { BaseQuery } from "../../utils/types/types";
import { HomeService } from "../../services/home.service";

export class HomeController {
  public static async index(
    req: Request<{}, {}, {}, BaseQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboardData = await HomeService.getDashboardData(req.query);
      res.status(200).json(dashboardData);
    } catch (error: any) {
      next(error);
    }
  }
}
