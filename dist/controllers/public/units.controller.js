"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUnitController = void 0;
const units_service_1 = require("../../services/units.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
class PublicUnitController {
    static async getUnits(req, res) {
        const [units, count] = await units_service_1.UnitService.getUnits({ ...req.query });
        res
            .status(200)
            .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, units));
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
}
exports.PublicUnitController = PublicUnitController;
