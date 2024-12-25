import { Request, Response } from "express";
import { UnitCategories } from "../entities/UnitCategories.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import ApiError from "../utils/ApiError";
import { Unit } from "../entities/Unit.model";
import { UnitCategoryType } from "../utils/validators/UnitValidator";

export class UnitCategoryController {
  // Create a new unit category
  static async createUnitCategory(
    req: Request<{}, {}, UnitCategoryType>,
    res: Response
  ): Promise<void> {
    try {
      // ToDo: check units
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError(req.t("unit-not-found"), 404);
      }
      const newUnitCategory = UnitCategories.create(req.body);
      await newUnitCategory.save();
      res.status(201).json(newUnitCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all unit categories with optional filters
  static async getUnitCategories(
    req: Request<
      {},
      {},
      {},
      {
        page: number;
        pageSize: number;
        name: string;
        status: string;
      }
    >,
    res: Response
  ): Promise<void> {
    try {
      const { page, pageSize, name, status } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = UnitCategories.createQueryBuilder("unitCategory");
      if (name) {
        querable.where("LOWER(unitCategory.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (status) {
        querable.where("LOWER(unitCategory.status) = LOWER(:status)", {
          status,
        });
      }
      const [unitCategories, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, unitCategories));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single unit category by ID
  static async getUnitCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const unitCategory = await UnitCategories.findOneBy({
        id: req.params.id,
      });
      if (!unitCategory) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(unitCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a unit category by ID
  static async updateUnitCategory(
    req: Request<{ id: string }, {}, UnitCategoryType>,
    res: Response
  ): Promise<void> {
    try {
      const unitCategory = await UnitCategories.findOneBy({
        id: req.params.id,
      });
      if (!unitCategory) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError(req.t("unit-not-found"), 404);
      }
      Object.assign(unitCategory, req.body);

      await unitCategory.save();
      res.status(200).json(unitCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a unit category by ID
  static async deleteUnitCategory(req: Request, res: Response): Promise<void> {
    try {
      const unitCategory = await UnitCategories.findOneBy({
        id: req.params.id,
      });
      if (!unitCategory) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      await unitCategory.softRemove();
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
