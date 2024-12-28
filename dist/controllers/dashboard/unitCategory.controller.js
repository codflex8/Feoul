"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCategoryController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const unitCategory_service_1 = require("../../services/unitCategory.service");
class UnitCategoryController {
    static async createUnitCategory(req, res) {
        try {
            const unitCategory = await unitCategory_service_1.UnitCategoryService.createUnitCategory(req.body, req.t);
            res.status(201).json(unitCategory);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getUnitCategories(req, res) {
        try {
            const [unitCategories, count] = await unitCategory_service_1.UnitCategoryService.getUnitCategories(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, unitCategories));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUnitCategoryById(req, res) {
        try {
            const unitCategory = await unitCategory_service_1.UnitCategoryService.getUnitCategoryById(req.params.id);
            if (!unitCategory) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(unitCategory);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateUnitCategory(req, res) {
        try {
            const unitCategory = await unitCategory_service_1.UnitCategoryService.updateUnitCategory(req.params.id, req.body, req.t);
            res.status(200).json(unitCategory);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteUnitCategory(req, res) {
        try {
            await unitCategory_service_1.UnitCategoryService.deleteUnitCategory(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.UnitCategoryController = UnitCategoryController;
