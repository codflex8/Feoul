import { Request, Response } from "express";
import { UnitCategoryType } from "../../utils/validators/UnitValidator";
import { GenericResponse } from "../../utils/GenericResponse";
import { UnitCategoryService } from "../../services/unitCategory.service";

export class UnitCategoryController {
  static async createUnitCategory(
    req: Request<{}, {}, UnitCategoryType>,
    res: Response
  ): Promise<void> {
    try {
      const unitCategory = await UnitCategoryService.createUnitCategory(
        req.body,
        req.t
      );
      res.status(201).json(unitCategory);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

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

  static async updateUnitCategory(
    req: Request<{ id: string }, {}, UnitCategoryType>,
    res: Response
  ): Promise<void> {
    try {
      const unitCategory = await UnitCategoryService.updateUnitCategory(
        req.params.id,
        req.body,
        req.t
      );
      res.status(200).json(unitCategory);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteUnitCategory(req: Request, res: Response): Promise<void> {
    try {
      await UnitCategoryService.deleteUnitCategory(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
