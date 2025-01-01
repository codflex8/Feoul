import { Request, Response, NextFunction, query } from "express";
import { UnitService } from "../../services/units.service";
import { UnitType } from "../../utils/validators/UnitValidator";
import { GenericResponse } from "../../utils/GenericResponse";

export class PublicUnitController {
  public static async getUnits(
    req: Request<
      {},
      {},
      {},
      {
        page: number;
        pageSize: number;
        priceFrom: number;
        priceTo: number;
      } & UnitType
    >,
    res: Response
  ) {
    const [units, count] = await UnitService.getUnits({ ...req.query });
    res
      .status(200)
      .json(
        new GenericResponse(req.query.page, req.query.pageSize, count, units)
      );
  }

  static async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const unit = await UnitService.getUnitById(req.params.id);
      if (!unit) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
