"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const Unit_model_1 = require("../entities/Unit.model");
const Project_model_1 = require("../entities/Project.model");
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class UnitService {
    static async createUnit(data, translate) {
        const { video, projectId, categoryId, number } = data;
        const isNumberExist = await Unit_model_1.Unit.getItemByNumber(number);
        if (isNumberExist) {
            throw new ApiError_1.default(translate("unit-number-used"), 409);
        }
        const project = await Project_model_1.Project.findOneBy({ id: projectId });
        if (!project) {
            throw new ApiError_1.default(translate("project_not_found"), 400);
        }
        const category = await UnitCategories_model_1.UnitCategories.findOneBy({ id: categoryId });
        if (!category) {
            throw new ApiError_1.default(translate("category_not_found"), 400);
        }
        const unit = Unit_model_1.Unit.create({
            ...data,
            videoUrl: video,
            project,
            category,
        });
        await unit.save();
        return unit;
    }
    static async getUnits(query) {
        const { page, pageSize, name, number, status, priceFrom, priceTo, projectId, categoryId, } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoin("unit.project", "project")
            .leftJoinAndSelect("unit.category", "category");
        if (categoryId) {
            queryBuilder.andWhere("category.id = :categoryId", { categoryId });
        }
        if (projectId) {
            queryBuilder.andWhere("project.id = :projectId", { projectId });
        }
        if (name) {
            queryBuilder.andWhere("LOWER(unit.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (number) {
            queryBuilder.andWhere("unit.number = :number", { number });
        }
        if (status) {
            queryBuilder.andWhere("LOWER(unit.status) = LOWER(:status)", { status });
        }
        if (priceFrom) {
            queryBuilder.andWhere("unit.price >= :priceFrom", { priceFrom });
        }
        if (priceTo) {
            queryBuilder.andWhere("unit.price <= :priceTo", { priceTo });
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async getUnitById(id) {
        return await Unit_model_1.Unit.findOneBy({ id });
    }
    static async updateUnit(id, data, translate) {
        const unit = await Unit_model_1.Unit.findOneBy({ id });
        if (!unit) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        const isNumberExist = await Unit_model_1.Unit.getItemByNumber(data.number);
        if (isNumberExist && isNumberExist.id !== unit.id) {
            throw new ApiError_1.default(translate("unit-number-used"), 409);
        }
        const project = await Project_model_1.Project.findOneBy({ id: data.projectId });
        if (!project) {
            throw new ApiError_1.default(translate("project_not_found"), 400);
        }
        const category = await UnitCategories_model_1.UnitCategories.findOneBy({ id: data.categoryId });
        if (!category) {
            throw new ApiError_1.default(translate("category_not_found"), 400);
        }
        Object.assign(unit, data);
        unit.category = category;
        unit.project = project;
        await unit.save();
        return unit;
    }
    static async deleteUnit(id, translate) {
        const unit = await Unit_model_1.Unit.findOneBy({ id });
        if (!unit) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        await unit.softRemove();
        return unit;
    }
}
exports.UnitService = UnitService;
