import { Request, Response } from "express";
import {
  SetUnitStatusType,
  UnitReverseType,
  UnitType,
} from "../../utils/validators/UnitValidator";
import { GenericResponse } from "../../utils/GenericResponse";
import { UnitService } from "../../services/units.service";

export class UnitController {
  static async createUnit(
    req: Request<{}, {}, UnitType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await UnitService.createUnit(req.body, req.t);
      res.status(201).json(unit);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async SetUnitStatus(
    req: Request<{ id: string }, SetUnitStatusType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await UnitService.setUnitStatus(
        req.params.id,
        req.body.status,
        req.t
      );
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async reserveUnit(
    req: Request<{ id: string }, {}, UnitReverseType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await UnitService.reserveUnit({
        unitId: req.params.id,
        intresetId: req.body.intresetId,
        translate: req.t,
        // price: req.body.price,
      });
      res.status(200).json({ message: "reserved success", unit });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async buyUnit(
    req: Request<{ id: string }, {}, UnitReverseType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await UnitService.buyUnit({
        unitId: req.params.id,
        intresetId: req.body.intresetId,
        translate: req.t,
        // price: req.body.price,
      });
      res.status(200).json({ message: "buy success", unit });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

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
      const [units, count] = await UnitService.getUnits(req.query);
      res
        .status(200)
        .json(
          new GenericResponse(req.query.page, req.query.pageSize, count, units)
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
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

  static async updateUnit(
    req: Request<{ id: string }, {}, UnitType>,
    res: Response
  ): Promise<void> {
    try {
      const unit = await UnitService.updateUnit(req.params.id, req.body, req.t);
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      await UnitService.deleteUnit(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
