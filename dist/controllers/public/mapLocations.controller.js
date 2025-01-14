"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicMapLocations = void 0;
const mapLocations_service_1 = require("../../services/mapLocations.service");
class PublicMapLocations {
    static async getMapLocations(req, res) {
        try {
            const locations = await mapLocations_service_1.MapLocationsService.getMapLocationsWithGroup();
            res.status(200).json(locations);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.PublicMapLocations = PublicMapLocations;
