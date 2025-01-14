import { Request, Response } from "express";
import { MapLocationType } from "../../utils/validators/MapLocation";
import { MapLocationsService } from "../../services/mapLocations.service";
import { GenericResponse } from "../../utils/GenericResponse";

export class PublicMapLocations {
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
      const locations = await MapLocationsService.getMapLocationsWithGroup();

      res.status(200).json(locations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
