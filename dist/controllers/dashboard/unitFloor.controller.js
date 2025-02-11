"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitFloorController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const unitFloor_service_1 = require("../../services/unitFloor.service");
class UnitFloorController {
    static async updateUnitCategoryFloors(req, res) {
        const updateUnitCategoryFloors = await unitFloor_service_1.UnitFloorService.updateUnitCategoryFloors(req.body, req.t);
        res.status(200).json({ message: req.t("update-success") });
    }
    static async createUnitFloor(req, res) {
        try {
            const unitFloor = await unitFloor_service_1.UnitFloorService.createUnitFloor({ ...req.body }, req.t);
            res.status(201).json(unitFloor);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getUnitFloor(req, res) {
        try {
            const [unitFloors, count] = await unitFloor_service_1.UnitFloorService.getUnitFloors(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, unitFloors));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUnitFloorById(req, res) {
        try {
            const unitFloor = await unitFloor_service_1.UnitFloorService.getUnitFloorById(req.params.id);
            if (!unitFloor) {
                res.status(404).json({ message: req.t("unit-floor-not-found") });
                return;
            }
            res.status(200).json(unitFloor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateUnitFloor(req, res) {
        try {
            const unitFloor = await unitFloor_service_1.UnitFloorService.updateUnitFloor(req.params.id, req.body, req.t);
            res.status(200).json(unitFloor);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteUnitFloor(req, res) {
        try {
            await unitFloor_service_1.UnitFloorService.deleteUnitFloor(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.UnitFloorController = UnitFloorController;
