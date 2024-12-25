import { Request, Response } from "express";
import { MapLocations } from "../entities/MapLocations.model";
import { MapLocationType } from "../utils/validators/MapLocation";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";

export class MapLocationController {
  // Create a new mapLocation
  static async createMapLocation(
    req: Request<{}, {}, MapLocationType>,
    res: Response
  ): Promise<void> {
    try {
      const mapLocation = MapLocations.create({
        ...req.body,
      });
      await mapLocation.save();
      res.status(201).json(mapLocation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all mapLocations with optional filters
  static async getMapLocations(
    req: Request<
      {},
      {},
      {},
      MapLocationType & { page: number; pageSize: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const { name, type, page, pageSize } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = MapLocations.createQueryBuilder("mapLocation");
      if (name) {
        querable.where("LOWER(mapLocation.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (type) {
        querable.where("LOWER(mapLocation.type) LIKE LOWER(:type)", {
          type: `%${type}%`,
        });
      }

      const [mapLocations, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();

      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, mapLocations));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single mapLocation by ID
  static async getMapLocationById(req: Request, res: Response): Promise<void> {
    try {
      const mapLocation = await MapLocations.findOneBy({ id: req.params.id });
      if (!mapLocation) {
        res.status(404).json({ message: req.t("map-location-not-found") });
        return;
      }
      res.status(200).json(mapLocation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a mapLocation by ID
  static async updateMapLocation(
    req: Request<{ id: string }, {}, MapLocationType>,
    res: Response
  ): Promise<void> {
    try {
      const mapLocation = await MapLocations.findOneBy({ id: req.params.id });
      if (!mapLocation) {
        res.status(404).json({ message: req.t("map-location-not-found") });
        return;
      }
      Object.assign(mapLocation, req.body);
      mapLocation.save();
      res.status(200).json(mapLocation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a mapLocation by ID
  static async deleteMapLocation(req: Request, res: Response): Promise<void> {
    try {
      const mapLocation = await MapLocations.findOneBy({ id: req.params.id });
      if (!mapLocation) {
        res.status(404).json({ message: req.t("map-location-not-found") });
        return;
      }
      await mapLocation.softRemove();
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
