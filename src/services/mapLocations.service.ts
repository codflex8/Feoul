import { TFunction } from "i18next";
import { MapLocations } from "../entities/MapLocations.model";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";
import { MapLocationType } from "../utils/validators/MapLocation";

export class MapLocationsService {
  static async createMapLocation(data: MapLocationType): Promise<MapLocations> {
    const mapLocation = MapLocations.create({
      ...data,
      lat: data.lat.toString(),
      lng: data.lng.toString(),
    });
    await mapLocation.save();
    return mapLocation;
  }

  static async getMapLocations(
    query: MapLocationType & { page: number; pageSize: number }
  ): Promise<[MapLocations[], number]> {
    const { name, type, page, pageSize } = query;
    const { skip, take } = getPaginationData({ page, pageSize });
    const querable = MapLocations.createQueryBuilder("mapLocation");
    if (name) {
      querable.andWhere("LOWER(mapLocation.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }
    if (type) {
      querable.andWhere("LOWER(mapLocation.type) LIKE LOWER(:type)", {
        type: `%${type}%`,
      });
    }

    const [mapLocations, count] = await querable
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [mapLocations, count];
  }

  static async getMapLocationsWithGroup() {
    const records = await MapLocations.createQueryBuilder("location").getMany();

    const groupedRecords = records.reduce((acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = [];
      }
      acc[record.type].push(record);
      return acc;
    }, {} as Record<string, MapLocations[]>);

    return groupedRecords;
  }

  public static async getMapLocationById(id: string) {
    const mapLocation = await MapLocations.findOneBy({ id });
    return mapLocation;
  }

  static async updateMapLocation({
    id,
    data,
    translate,
  }: {
    id: string;
    data: MapLocationType;
    translate: TFunction;
  }): Promise<MapLocations> {
    const mapLocation = await MapLocations.findOneBy({ id });
    if (!mapLocation) {
      throw new ApiError(translate("map-location-not-found"), 404);
    }
    Object.assign(mapLocation, data);
    mapLocation.save();
    return mapLocation;
  }

  public static async deleteMapLocation(
    id: string,
    translate: TFunction
  ): Promise<MapLocations> {
    const mapLocation = await MapLocations.findOneBy({ id });
    if (!mapLocation) {
      throw new ApiError(translate("map-location-not-found"), 404);
    }
    await mapLocation.softRemove();
    return mapLocation;
  }
}
