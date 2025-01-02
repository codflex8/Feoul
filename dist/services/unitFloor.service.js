"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitFloorService = void 0;
const UnitFloor_model_1 = require("../entities/UnitFloor.model");
const Unit_model_1 = require("../entities/Unit.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class UnitFloorService {
    static async createUnitFloor(data, translate) {
        const unit = await Unit_model_1.Unit.findOneBy({ id: data.unitId });
        if (!unit) {
            throw new ApiError_1.default(translate("unit-not-found"), 404);
        }
        const newUnitFloor = UnitFloor_model_1.UnitFloor.create(data);
        newUnitFloor.unit = unit;
        newUnitFloor.imageUrl = data.image;
        await newUnitFloor.save();
        return newUnitFloor;
    }
    static async getUnitFloors(query) {
        const { page, pageSize, name, index, unitId } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = UnitFloor_model_1.UnitFloor.createQueryBuilder("unitFloor").leftJoinAndSelect("unitFloor.unit", "unit");
        if (name) {
            queryBuilder.andWhere("LOWER(unitFloor.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (index) {
            queryBuilder.andWhere("unitFloor.index = :index", { index });
        }
        if (unitId) {
            queryBuilder.andWhere("unit.id = :unitId", { unitId });
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async getUnitFloorById(id) {
        return await UnitFloor_model_1.UnitFloor.findOneBy({ id });
    }
    static async updateUnitFloor(id, data, translate) {
        const unitFloor = await UnitFloor_model_1.UnitFloor.findOneBy({ id });
        if (!unitFloor) {
            throw new ApiError_1.default(translate("unit-floor-not-found"), 404);
        }
        if (data.unitId) {
            const unit = await Unit_model_1.Unit.findOneBy({ id: data.unitId });
            if (!unit) {
                throw new ApiError_1.default(translate("unit-not-found"), 404);
            }
            unitFloor.unit = unit;
        }
        if (data.image) {
            unitFloor.imageUrl = data.image;
        }
        Object.assign(unitFloor, data);
        await unitFloor.save();
        return unitFloor;
    }
    static async deleteUnitFloor(id, translate) {
        const unitFloor = await UnitFloor_model_1.UnitFloor.findOneBy({ id });
        if (!unitFloor) {
            throw new ApiError_1.default(translate("unit-floor-not-found"), 404);
        }
        await unitFloor.softRemove();
        return unitFloor;
    }
}
exports.UnitFloorService = UnitFloorService;
