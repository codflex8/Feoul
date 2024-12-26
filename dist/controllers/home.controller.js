"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const Project_model_1 = require("../entities/Project.model");
const Unit_model_1 = require("../entities/Unit.model");
const UnitIntreset_model_1 = require("../entities/UnitIntreset.model");
class HomeController {
    static async index(req, res, next) {
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
        res.status(200).json({
            projectsCount,
            unitsCount,
            intresetCount,
            unitIntresetsData,
        });
    }
}
exports.HomeController = HomeController;
