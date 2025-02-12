import { Request, Response } from "express";
import {
  unitCategoryFloorUpdateType,
  UnitFloorType,
} from "../../utils/validators/UnitValidator";
import { GenericResponse } from "../../utils/GenericResponse";
import { UnitFloorService } from "../../services/unitFloor.service";

export class UnitFloorController {
  static async updateUnitCategoryFloors(
    req: Request<{}, {}, unitCategoryFloorUpdateType>,
    res: Response
  ): Promise<void> {
    const updateUnitCategoryFloors =
      await UnitFloorService.updateUnitCategoryFloors(req.body, req.t);
    res.status(200).json({ message: req.t("update-success") });
  }

  static async addUnitCategoryFloors(
    req: Request<{}, {}, unitCategoryFloorUpdateType>,
    res: Response
  ): Promise<void> {
    await UnitFloorService.addUnitCategoryFloors(req.body, req.t);
    res.status(200).json({ message: req.t("add-success") });
  }

  static async createUnitFloor(
    req: Request<{}, {}, UnitFloorType>,
    res: Response
  ): Promise<void> {
    try {
      const unitFloor = await UnitFloorService.createUnitFloor(
        { ...req.body },
        req.t
      );
      res.status(201).json(unitFloor);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

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
      const [unitFloors, count] = await UnitFloorService.getUnitFloors(
        req.query
      );
      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            unitFloors
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUnitFloorById(req: Request, res: Response): Promise<void> {
    try {
      const unitFloor = await UnitFloorService.getUnitFloorById(req.params.id);
      if (!unitFloor) {
        res.status(404).json({ message: req.t("unit-floor-not-found") });
        return;
      }
      res.status(200).json(unitFloor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateUnitFloor(
    req: Request<{ id: string }, {}, Partial<UnitFloorType>>,
    res: Response
  ): Promise<void> {
    try {
      const unitFloor = await UnitFloorService.updateUnitFloor(
        req.params.id,
        req.body,
        req.t
      );
      res.status(200).json(unitFloor);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteUnitFloor(req: Request, res: Response): Promise<void> {
    try {
      await UnitFloorService.deleteUnitFloor(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
