import { Request, Response } from "express";
import { UnitIntresetType } from "../../utils/validators/UnitValidator";
import { GenericResponse } from "../../utils/GenericResponse";
import { UnitInterestService } from "../../services/unitIntreset.service";

export class UnitIntresetController {
  static async createUnitIntreset(
    req: Request<{}, {}, UnitIntresetType>,
    res: Response
  ): Promise<void> {
    try {
      const unitInterest = await UnitInterestService.createUnitInterest(
        req.body,
        req.t
      );
      res.status(201).json(unitInterest);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async getUnitIntreset(req: Request, res: Response): Promise<void> {
    try {
      const [unitInterests, count] = await UnitInterestService.getUnitInterests(
        req.query
      );
      res
        .status(200)
        .json(
          new GenericResponse(
            Number(req.query.page ?? 1),
            Number(req.query.pageSize ?? 10),
            count,
            unitInterests
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUnitIntresetById(req: Request, res: Response): Promise<void> {
    try {
      const unitInterest = await UnitInterestService.getUnitInterestById(
        req.params.id,
        req.t
      );
      res.status(200).json(unitInterest);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async updateUnitIntreset(
    req: Request<{ id: string }, {}, Partial<UnitIntresetType>>,
    res: Response
  ): Promise<void> {
    try {
      const unitInterest = await UnitInterestService.updateUnitInterest(
        req.params.id,
        req.body,
        req.t
      );
      res.status(200).json(unitInterest);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteUnitIntreset(req: Request, res: Response): Promise<void> {
    try {
      await UnitInterestService.deleteUnitInterest(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
