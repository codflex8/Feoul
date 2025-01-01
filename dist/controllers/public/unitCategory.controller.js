"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUnitCategory = void 0;
const unitCategory_service_1 = require("../../services/unitCategory.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
class PublicUnitCategory {
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
}
exports.PublicUnitCategory = PublicUnitCategory;
