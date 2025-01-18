import { Request, Response } from "express";
import { UnitIntresetType } from "../../utils/validators/UnitValidator";
import { UnitInterestService } from "../../services/unitIntreset.service";

export class PublicUnitIntresets {
  static async createUnitIntresert(
    req: Request<{}, {}, UnitIntresetType>,
    res: Response
  ) {
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
}
