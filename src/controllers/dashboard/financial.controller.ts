import { NextFunction, Request, Response } from "express";
import { FinancialService } from "../../services/financial.service";
import { GenericResponse } from "../../utils/GenericResponse";
import { BaseQuery } from "../../utils/types/types";

export class FinancialController {
  static async getFinancial(
    req: Request<{}, {}, {}, BaseQuery>,
    res: Response,
    next: NextFunction
  ) {
    const [interests, count] = await FinancialService.getFinancialStatistics();
    res
      .status(200)
      .json(
        new GenericResponse(
          req.query.page,
          req.query.pageSize,
          count,
          interests
        )
      );
  }
}
