"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapLocationController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const mapLocations_service_1 = require("../../services/mapLocations.service");
class MapLocationController {
    // Create a new mapLocation
    static async createMapLocation(req, res) {
        try {
            const mapLocation = await mapLocations_service_1.MapLocationsService.createMapLocation({
                ...req.body,
            });
            res.status(201).json(mapLocation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all mapLocations with optional filters
    static async getMapLocations(req, res) {
        try {
            const [mapLocations, count] = await mapLocations_service_1.MapLocationsService.getMapLocations(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, mapLocations));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single mapLocation by ID
    static async getMapLocationById(req, res) {
        try {
            const mapLocation = await mapLocations_service_1.MapLocationsService.getMapLocationById(req.params.id);
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
            const mapLocation = await mapLocations_service_1.MapLocationsService.updateMapLocation({
                id: req.params.id,
                data: req.body,
                translate: req.t,
            });
            res.status(200).json(mapLocation);
        }
        catch (error) {
            res.status(error?.statusCode ?? 400).json({ error: error.message });
        }
    }
    // Delete a mapLocation by ID
    static async deleteMapLocation(req, res) {
        try {
            const mapLocation = await mapLocations_service_1.MapLocationsService.deleteMapLocation(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.MapLocationController = MapLocationController;
