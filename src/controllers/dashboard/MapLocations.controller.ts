import { Request, Response } from "express";
import { MapLocations } from "../../entities/MapLocations.model";
import { MapLocationType } from "../../utils/validators/MapLocation";
import { getPaginationData } from "../../utils/getPaginationData";
import { GenericResponse } from "../../utils/GenericResponse";
import { MapLocationsService } from "../../services/mapLocations.service";

export class MapLocationController {
  // Create a new mapLocation
  static async createMapLocation(
    req: Request<{}, {}, MapLocationType>,
    res: Response
  ): Promise<void> {
    try {
      const mapLocation = await MapLocationsService.createMapLocation({
        ...req.body,
      });
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
      const [mapLocations, count] = await MapLocationsService.getMapLocations(
        req.query
      );

      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            mapLocations
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single mapLocation by ID
  static async getMapLocationById(req: Request, res: Response): Promise<void> {
    try {
      const mapLocation = await MapLocationsService.getMapLocationById(
        req.params.id
      );
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
      const mapLocation = await MapLocationsService.updateMapLocation({
        id: req.params.id,
        data: req.body,
        translate: req.t,
      });
      res.status(200).json(mapLocation);
    } catch (error: any) {
      res.status(error?.statusCode ?? 400).json({ error: error.message });
    }
  }

  // Delete a mapLocation by ID
  static async deleteMapLocation(req: Request, res: Response): Promise<void> {
    try {
      const mapLocation = await MapLocationsService.deleteMapLocation(
        req.params.id,
        req.t
      );
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
