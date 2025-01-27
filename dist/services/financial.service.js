"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialService = void 0;
const Unit_model_1 = require("../entities/Unit.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
class FinancialService {
    static async getFinancialStatistics(page = 1, pageSize = 10) {
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        return await Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.interests", "interests"
        // "interests.status = :intreset",
        // { intreset: UnitIntresetStatus.buy }
        )
            .where("interests.status = :intreset", {
            intreset: UnitValidator_1.UnitIntresetStatus.buy,
        })
            .select(["unit.id", "unit.number", "unit.price", "unit.name"])
            .addSelect("interests")
            .skip(skip)
            .take(take)
            .getManyAndCount();
        // return [unitsIntresets, count];
    }
}
exports.FinancialService = FinancialService;
