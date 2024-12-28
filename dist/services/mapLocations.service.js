"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapLocationsService = void 0;
const MapLocations_model_1 = require("../entities/MapLocations.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class MapLocationsService {
    static async createMapLocation(data) {
        const mapLocation = MapLocations_model_1.MapLocations.create({
            ...data,
        });
        await mapLocation.save();
        return mapLocation;
    }
    static async getMapLocations(query) {
        const { name, type, page, pageSize } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const querable = MapLocations_model_1.MapLocations.createQueryBuilder("mapLocation");
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
    static async getMapLocationById(id) {
        const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id });
        return mapLocation;
    }
    static async updateMapLocation({ id, data, translate, }) {
        const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id });
        if (!mapLocation) {
            throw new ApiError_1.default(translate("map-location-not-found"), 404);
        }
        Object.assign(mapLocation, data);
        mapLocation.save();
        return mapLocation;
    }
    static async deleteMapLocation(id, translate) {
        const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id });
        if (!mapLocation) {
            throw new ApiError_1.default(translate("map-location-not-found"), 404);
        }
        await mapLocation.softRemove();
        return mapLocation;
    }
}
exports.MapLocationsService = MapLocationsService;
