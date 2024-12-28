"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const Project_model_1 = require("../entities/Project.model");
const Unit_model_1 = require("../entities/Unit.model");
const UnitIntreset_model_1 = require("../entities/UnitIntreset.model");
const getPaginationData_1 = require("../utils/getPaginationData");
class HomeController {
    static async index(req, res, next) {
        const { page, pageSize } = req.query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const projectsCount = await Project_model_1.Project.count();
        const unitsCount = await Unit_model_1.Unit.count();
        const intresetCount = await UnitIntreset_model_1.UnitIntreset.count();
        const unitIntresetsData = await Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoin("unit.interests", "interests")
            .select("COUNT(interests.id)", "intresetsCount")
            .addSelect("unit.id", "unitId")
            .addSelect("unit.name", "unitName")
            .groupBy("unit.id")
            .getRawMany();
        const lastIntresets = await Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoin("unit.interests", "interests")
            .addSelect((subQuery) => {
            return subQuery
                .select("COUNT(interests.id)", "intresetsCount")
                .from("UnitIntreset", "interests")
                .where("interests.unitId = unit.id");
        }, "intresetsCount")
            .orderBy("intresetsCount", "ASC")
            .skip(skip)
            .take(take)
            .getMany();
        res.status(200).json({
            projectsCount,
            unitsCount,
            intresetCount,
            unitIntresetsData,
            lastIntresets,
        });
    }
}
exports.HomeController = HomeController;
