"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitIntresetController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const unitIntreset_service_1 = require("../../services/unitIntreset.service");
class UnitIntresetController {
    static async createUnitIntreset(req, res) {
        try {
            const unitInterest = await unitIntreset_service_1.UnitInterestService.createUnitInterest(req.body, req.t);
            res.status(201).json(unitInterest);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getUnitIntreset(req, res) {
        try {
            const [unitInterests, count] = await unitIntreset_service_1.UnitInterestService.getUnitInterests(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(Number(req.query.page ?? 1), Number(req.query.pageSize ?? 10), count, unitInterests));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUnitIntresetById(req, res) {
        try {
            const unitInterest = await unitIntreset_service_1.UnitInterestService.getUnitInterestById(req.params.id, req.t);
            res.status(200).json(unitInterest);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async updateUnitIntreset(req, res) {
        try {
            const unitInterest = await unitIntreset_service_1.UnitInterestService.updateUnitInterest(req.params.id, req.body, req.t);
            res.status(200).json(unitInterest);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteUnitIntreset(req, res) {
        try {
            await unitIntreset_service_1.UnitInterestService.deleteUnitInterest(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async setUnitInterestStatus(req, res) {
        const { status } = req.body;
        try {
            const unitIntreset = await unitIntreset_service_1.UnitInterestService.setUnitIntresetStatus(req.params.id, status, req.t);
            res.status(200).json({ unitIntreset });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.UnitIntresetController = UnitIntresetController;
