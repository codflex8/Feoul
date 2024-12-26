"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapLocationController = void 0;
const MapLocations_model_1 = require("../entities/MapLocations.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
class MapLocationController {
    // Create a new mapLocation
    static async createMapLocation(req, res) {
        try {
            const mapLocation = MapLocations_model_1.MapLocations.create({
                ...req.body,
            });
            await mapLocation.save();
            res.status(201).json(mapLocation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all mapLocations with optional filters
    static async getMapLocations(req, res) {
        try {
            const { name, type, page, pageSize } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = MapLocations_model_1.MapLocations.createQueryBuilder("mapLocation");
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
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, mapLocations));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single mapLocation by ID
    static async getMapLocationById(req, res) {
        try {
            const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id: req.params.id });
            if (!mapLocation) {
                res.status(404).json({ message: req.t("map-location-not-found") });
                return;
            }
            res.status(200).json(mapLocation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a mapLocation by ID
    static async updateMapLocation(req, res) {
        try {
            const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id: req.params.id });
            if (!mapLocation) {
                res.status(404).json({ message: req.t("map-location-not-found") });
                return;
            }
            Object.assign(mapLocation, req.body);
            mapLocation.save();
            res.status(200).json(mapLocation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a mapLocation by ID
    static async deleteMapLocation(req, res) {
        try {
            const mapLocation = await MapLocations_model_1.MapLocations.findOneBy({ id: req.params.id });
            if (!mapLocation) {
                res.status(404).json({ message: req.t("map-location-not-found") });
                return;
            }
            await mapLocation.softRemove();
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.MapLocationController = MapLocationController;
