"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const Project_model_1 = require("../entities/Project.model");
const Unit_model_1 = require("../entities/Unit.model");
const UnitIntreset_model_1 = require("../entities/UnitIntreset.model");
const getPaginationData_1 = require("../utils/getPaginationData");
class HomeService {
    static async getDashboardData(query) {
        const { page, pageSize } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const [projectsCount, unitsCount, intresetCount, unitIntresetsData, lastIntresets,] = await Promise.all([
            Project_model_1.Project.count(),
            Unit_model_1.Unit.count(),
            UnitIntreset_model_1.UnitIntreset.count(),
            Unit_model_1.Unit.createQueryBuilder("unit")
                .leftJoin("unit.interests", "interests")
                .select("COUNT(interests.id)", "intresetsCount")
                .addSelect("unit.id", "unitId")
                .addSelect("unit.name", "unitName")
                .groupBy("unit.id")
                .getRawMany(),
            UnitIntreset_model_1.UnitIntreset.createQueryBuilder("unitIntreset")
                .leftJoinAndSelect("unitIntreset.unit", "unit")
                .orderBy("unitIntreset.createdAt", "DESC")
                .skip(skip)
                .take(take)
                .select("unitIntreset")
                .addSelect([
                "unit.name",
                "unit.id",
                "unit.number",
                "unit.category",
                "unit.price",
            ])
                .getMany(),
            // Unit.createQueryBuilder("unit")
            //   .leftJoin("unit.interests", "interests")
            //   .addSelect((subQuery) => {
            //     return subQuery
            //       .select("COUNT(interests.id)", "intresetsCount")
            //       .from("UnitIntreset", "interests")
            //       .where("interests.unitId = unit.id");
            //   }, "intresetsCount")
            //   .orderBy("intresetsCount", "ASC")
            //   .skip(skip)
            //   .take(take)
            //   .getMany(),
        ]);
        return {
            projectsCount,
            unitsCount,
            intresetCount,
            unitIntresetsData,
            lastIntresets,
        };
    }
}
exports.HomeService = HomeService;
