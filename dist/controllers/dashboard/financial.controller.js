"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialController = void 0;
const financial_service_1 = require("../../services/financial.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
class FinancialController {
    static async getFinancial(req, res, next) {
        const [interests, count] = await financial_service_1.FinancialService.getFinancialStatistics();
        res
            .status(200)
            .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, interests));
    }
}
exports.FinancialController = FinancialController;
