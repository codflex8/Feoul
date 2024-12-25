import { Request, Response } from "express";
import { Unit } from "../entities/Unit.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { UnitType } from "../utils/validators/UnitValidator";
import { Project } from "../entities/Project.model";
import ApiError from "../utils/ApiError";

export class UnitController {
  // Create a new unit
  static async createUnit(
    req: Request<{}, {}, { video: string } & UnitType>,
    res: Response
  ): Promise<void> {
    try {
      const { video, projectId } = req.body;
      const project = await Project.findOneBy({ id: projectId });
      if (!project) {
        throw new ApiError(req.t("project_not_found"), 400);
      }
      const unit = Unit.create({
        ...req.body,
        videoUrl: video,
        project,
      });
      await unit.save();
      res.status(201).json(unit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all units with optional filters
  static async getUnits(
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
  ): Promise<void> {
    try {
      const { page, pageSize, name, number, status, priceFrom, priceTo } =
        req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = Unit.createQueryBuilder("unit");
      if (name) {
        querable.where("LOWER(unit.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (number) {
        querable.where("unit.number = :number", {
          number,
        });
      }
      if (status) {
        querable.where("LOWER(unit.status) = :LOWER(status)", {
          status,
        });
      }
      if (priceFrom && priceTo) {
        querable.where("unit.price >= :priceFrom AND unit.price <= :priceTo", {
          priceFrom,
          priceTo,
        });
      }
      const [units, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res.status(200).json(new GenericResponse(page, pageSize, count, units));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single unit by ID
  static async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.findOneBy({ id: req.params.id });
      if (!unit) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a unit by ID
  static async updateUnit(
    req: Request<{ id: string }, {}, UnitType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await Unit.findOneBy({ id: req.params.id });
      if (!unit) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      const project = await Project.findOneBy({ id: req.body.projectId });
      if (!project) {
        throw new ApiError(req.t("project_not_found"), 400);
      }
      Object.assign(unit, req.body);
      await unit.save();
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a unit by ID
  static async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const unit = await Unit.findOneBy({ id: req.params.id });
      if (!unit) {
        res.status(404).json({ message: "Unit not found" });
        return;
      }
      await unit.softRemove();
      res.status(200).json({ message: "Unit deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
