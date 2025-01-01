import { Request, Response } from "express";
import { UnitCategoryService } from "../../services/unitCategory.service";
import { GenericResponse } from "../../utils/GenericResponse";

export class PublicUnitCategory {
  static async getUnitCategories(
    req: Request<
      {},
      {},
      {},
      { page: number; pageSize: number; name: string; status: string }
    >,
    res: Response
  ): Promise<void> {
    try {
      const [unitCategories, count] =
        await UnitCategoryService.getUnitCategories(req.query);
      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            unitCategories
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUnitCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const unitCategory = await UnitCategoryService.getUnitCategoryById(
        req.params.id
      );
      if (!unitCategory) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(unitCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
