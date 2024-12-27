import { Request, Response } from "express";
import { UnitFloor } from "../entities/UnitFloor.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import ApiError from "../utils/ApiError";
import { Unit } from "../entities/Unit.model";
import { UnitFloorType } from "../utils/validators/UnitValidator";

export class UnitFloorController {
  // Create a new unit category
  static async createUnitFloor(
    req: Request<{}, {}, UnitFloorType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError("unit not found", 404);
      }
      const newUnitFloor = UnitFloor.create(req.body);
      newUnitFloor.unit = unit;
      await newUnitFloor.save();
      res.status(201).json(newUnitFloor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all unit categories with optional filters
  static async getUnitFloor(
    req: Request<
      {},
      {},
      {},
      {
        page: number;
        pageSize: number;
        name: string;
        index: string;
        unitId: string;
      }
    >,
    res: Response
  ): Promise<void> {
    try {
      const { page, pageSize, name, index, unitId } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = UnitFloor.createQueryBuilder(
        "unitFloor"
      ).leftJoinAndSelect("unitFloor.unit", "unit");
      if (name) {
        querable.andWhere("LOWER(unitFloor.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (index) {
        querable.andWhere("unitFloor.index = :index", {
          index,
        });
      }
      if (unitId) {
        querable.andWhere("unit.id = :unitId", { unitId });
      }
      const [unitFloors, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, unitFloors));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single unit category by ID
  static async getUnitFloorById(req: Request, res: Response): Promise<void> {
    try {
      const unitFloor = await UnitFloor.findOneBy({
        id: req.params.id,
      });
      if (!unitFloor) {
        res.status(404).json({ message: "Unit Floor not found" });
        return;
      }
      res.status(200).json(unitFloor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a unit category by ID
  static async updateUnitFloor(
    req: Request<{ id: string }, {}, Partial<UnitFloorType>>,
    res: Response
  ): Promise<void> {
    try {
      const { image } = req.body;
      const unitFloor = await UnitFloor.findOneBy({
        id: req.params.id,
      });
      if (!unitFloor) {
        res.status(404).json({ message: "Unit Floor not found" });
        return;
      }
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError("unit not found", 404);
      }
      Object.assign(unitFloor, req.body);
      if (image) {
        unitFloor.imageUrl = image;
      }
      unitFloor.unit = unit;
      await unitFloor.save();
      res.status(200).json(unitFloor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a unit category by ID
  static async deleteUnitFloor(req: Request, res: Response): Promise<void> {
    try {
      const unitFloor = await UnitFloor.findOneBy({
        id: req.params.id,
      });
      if (!unitFloor) {
        res.status(404).json({ message: "Unit Floor not found" });
        return;
      }
      await unitFloor.softRemove();
      res.status(200).json({ message: "Unit Floor deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
