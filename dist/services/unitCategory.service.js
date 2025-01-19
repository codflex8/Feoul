"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCategoryService = void 0;
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class UnitCategoryService {
    static async createUnitCategory(data, translate) {
        const isNumberExist = await UnitCategories_model_1.UnitCategories.getItemByNumber(data.number);
        if (isNumberExist) {
            throw new ApiError_1.default(translate("unit-category-number-used"), 409);
        }
        const newUnitCategory = UnitCategories_model_1.UnitCategories.create({ ...data });
        await newUnitCategory.save();
        return newUnitCategory;
    }
    static async getUnitCategories(query) {
        const { page, pageSize, name, status } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = UnitCategories_model_1.UnitCategories.createQueryBuilder("unitCategory");
        if (name) {
            queryBuilder.andWhere("LOWER(unitCategory.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (status) {
            queryBuilder.andWhere("LOWER(unitCategory.status) = LOWER(:status)", {
                status,
            });
        }
        return await queryBuilder
            .orderBy("name", "ASC")
            .skip(skip)
            .take(take)
            .getManyAndCount();
    }
    static async getUnitCategoryById(id) {
        return await UnitCategories_model_1.UnitCategories.findOneBy({ id });
    }
    static async updateUnitCategory(id, data, translate) {
        const unitCategory = await UnitCategories_model_1.UnitCategories.findOneBy({ id });
        if (!unitCategory) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        Object.assign(unitCategory, data);
        await unitCategory.save();
        return unitCategory;
    }
    static async deleteUnitCategory(id, translate) {
        const unitCategory = await UnitCategories_model_1.UnitCategories.findOneBy({ id });
        if (!unitCategory) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        await unitCategory.softRemove();
        return unitCategory;
    }
}
exports.UnitCategoryService = UnitCategoryService;
