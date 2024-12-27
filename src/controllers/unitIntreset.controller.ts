import { Request, Response } from "express";
import { UnitIntreset } from "../entities/UnitIntreset.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import ApiError from "../utils/ApiError";
import { Unit } from "../entities/Unit.model";
import { UnitIntresetType } from "../utils/validators/UnitValidator";

export class UnitIntresetController {
  // Create a new unit category
  static async createUnitIntreset(
    req: Request<{}, {}, UnitIntresetType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError("unit not found", 404);
      }
      const newUnitIntreset = UnitIntreset.create(req.body);
      newUnitIntreset.unit = unit;
      await newUnitIntreset.save();
      res.status(201).json(newUnitIntreset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all unit categories with optional filters
  static async getUnitIntreset(req: Request, res: Response): Promise<void> {
    try {
      const {
        page,
        pageSize,
        unitId,
        firstName,
        lastName,
        area,
        phoneNumber,
        email,
        status,
      } = req.query;
      const { skip, take } = getPaginationData({
        page: Number(page ?? 1),
        pageSize: Number(pageSize ?? 10),
      });
      const querable = UnitIntreset.createQueryBuilder("unitIntreset").leftJoin(
        "unitIntreset.unit",
        "unit"
      );
      if (firstName) {
        querable.andWhere(
          "LOWER(unitIntreset.firstName) LIKE LOWER(:firstName)",
          {
            firstName: `%${firstName}%`,
          }
        );
      }
      if (lastName) {
        querable.andWhere(
          "LOWER(unitIntreset.lastName) LIKE LOWER(:lastName)",
          {
            lastName: `%${lastName}%`,
          }
        );
      }
      if (area) {
        querable.andWhere("unitIntreset.area = :area", {
          area,
        });
      }
      if (phoneNumber) {
        querable.andWhere("unitIntreset.phoneNumber = :phoneNumber", {
          phoneNumber,
        });
      }
      if (email) {
        querable.andWhere("unitIntreset.email = :email", {
          email,
        });
      }
      if (status) {
        querable.andWhere("LOWER(unitIntreset.status) = LOWER(:status)", {
          status,
        });
      }

      if (unitId) {
        querable.andWhere("unit.id = :unitId", { unitId });
      }

      const [unitIntresets, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res
        .status(200)
        .json(
          new GenericResponse(
            Number(page),
            Number(pageSize),
            count,
            unitIntresets
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single unit category by ID
  static async getUnitIntresetById(req: Request, res: Response): Promise<void> {
    try {
      const unitIntreset = await UnitIntreset.findOneBy({
        id: req.params.id,
      });
      if (!unitIntreset) {
        res.status(404).json({ message: "Unit Intreset not found" });
        return;
      }
      res.status(200).json(unitIntreset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a unit category by ID
  static async updateUnitIntreset(
    req: Request<{ id: string }, {}, Partial<UnitIntresetType>>,
    res: Response
  ): Promise<void> {
    try {
      const unitIntreset = await UnitIntreset.findOneBy({
        id: req.params.id,
      });
      if (!unitIntreset) {
        res.status(404).json({ message: "Unit Intreset not found" });
        return;
      }
      const unit = await Unit.findOneBy({ id: req.body.unitId });
      if (!unit) {
        throw new ApiError("unit not found", 404);
      }
      Object.assign(unitIntreset, req.body);
      unitIntreset.unit = unit;
      await unitIntreset.save();
      res.status(200).json(unitIntreset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a unit category by ID
  static async deleteUnitIntreset(req: Request, res: Response): Promise<void> {
    try {
      const unitIntreset = await UnitIntreset.findOneBy({
        id: req.params.id,
      });
      if (!unitIntreset) {
        res.status(404).json({ message: "Unit Intreset not found" });
        return;
      }
      await unitIntreset.softRemove();
      res.status(200).json({ message: "Unit Intreset deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
