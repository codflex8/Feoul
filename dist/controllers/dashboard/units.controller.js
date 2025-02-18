"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const units_service_1 = require("../../services/units.service");
class UnitController {
    static async createUnit(req, res) {
        try {
            const unit = await units_service_1.UnitService.createUnit(req.body, req.t);
            res.status(201).json(unit);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async SetUnitStatus(req, res) {
        try {
            const unit = await units_service_1.UnitService.setUnitStatus(req.params.id, req.body.status, req.t);
            res.status(200).json(unit);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async reserveUnit(req, res) {
        try {
            const unit = await units_service_1.UnitService.reserveUnit({
                unitId: req.params.id,
                intresetId: req.body.intresetId,
                translate: req.t,
                // price: req.body.price,
            });
            res.status(200).json({ message: "reserved success", unit });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async buyUnit(req, res) {
        try {
            const unit = await units_service_1.UnitService.buyUnit({
                unitId: req.params.id,
                intresetId: req.body.intresetId,
                translate: req.t,
                // price: req.body.price,
            });
            res.status(200).json({ message: "buy success", unit });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getUnits(req, res) {
        try {
            const [units, count] = await units_service_1.UnitService.getUnits(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, units));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUnitById(req, res) {
        try {
            const unit = await units_service_1.UnitService.getUnitById(req.params.id);
            if (!unit) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(unit);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateUnit(req, res) {
        try {
            const unit = await units_service_1.UnitService.updateUnit(req.params.id, req.body, req.t);
            res.status(200).json(unit);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteUnit(req, res) {
        try {
            await units_service_1.UnitService.deleteUnit(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async updateUnitsStatusByNumbers(req, res) {
        await units_service_1.UnitService.changeUnitsStatusByNumbers({
            numbers: req.body.numbers,
            status: req.body.status,
        });
        res.status(200).json({ message: "update success" });
    }
}
exports.UnitController = UnitController;
