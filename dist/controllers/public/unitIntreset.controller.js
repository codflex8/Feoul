"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUnitIntresets = void 0;
const unitIntreset_service_1 = require("../../services/unitIntreset.service");
class PublicUnitIntresets {
    static async createUnitIntresert(req, res) {
        try {
            const unitInterest = await unitIntreset_service_1.UnitInterestService.createUnitInterest(req.body, req.t);
            res.status(201).json(unitInterest);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.PublicUnitIntresets = PublicUnitIntresets;
