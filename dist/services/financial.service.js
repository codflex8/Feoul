"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialService = void 0;
const unitIntreset_service_1 = require("./unitIntreset.service");
class FinancialService {
    static async getFinancialStatistics() {
        const unitsIntresets = await unitIntreset_service_1.UnitInterestService.getUnitInterests({
            financial: true,
        });
        return unitsIntresets;
    }
}
exports.FinancialService = FinancialService;
