"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const Unit_model_1 = require("../entities/Unit.model");
const Project_model_1 = require("../entities/Project.model");
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
const unitIntreset_service_1 = require("./unitIntreset.service");
class UnitService {
    static async createUnit(data, translate) {
        const { projectId, categoryId, number, position_x, position_y } = data;
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
            // videoUrl,
            project,
            category,
            position: [position_x, position_y],
        });
        await unit.save();
        return unit;
    }
    static async getUnits(query) {
        const { page, pageSize, name, number, status, priceFrom, priceTo, projectId, categoryId, selectAll = false, } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.project", "project")
            .leftJoinAndSelect("unit.category", "category")
            .leftJoinAndSelect("unit.floors", "floors");
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
        if (!selectAll) {
            queryBuilder.skip(skip).take(take);
        }
        return await queryBuilder.orderBy("unit.number", "ASC").getManyAndCount();
    }
    static async getProjectUnitsGroupedByStatus(projectId) {
        const querable = Unit_model_1.Unit.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.project", "project")
            .leftJoinAndSelect("unit.floors", "floor")
            .leftJoinAndSelect("unit.category", "category")
            .where("project.id = :projectId", { projectId })
            .orderBy("unit.number", "ASC");
        const unitsPriceRange = await querable
            .clone()
            .select("Max(unit.price)", "maxPrice")
            .addSelect("Min(unit.price)", "minPrice")
            .getRawOne();
        const unitsSpaceRange = await querable
            .clone()
            .select("Max(unit.landSpace)", "maxSpace")
            .addSelect("Min(unit.landSpace)", "minSpace")
            .getRawOne();
        const reverseUnits = await querable
            .clone()
            .andWhere("unit.status = :reverseStatus", {
            reverseStatus: UnitValidator_1.UnitStatus.reserved,
        })
            // .select("unit")
            // .groupBy("unit.status")
            .getMany();
        const avaliableUnits = await querable
            .clone()
            .andWhere("unit.status = :reverseStatus", {
            reverseStatus: UnitValidator_1.UnitStatus.avaliable,
        })
            .getMany();
        const saledUnits = await querable
            .clone()
            .andWhere("unit.status = :reverseStatus", {
            reverseStatus: UnitValidator_1.UnitStatus.saled,
        })
            .getMany();
        return {
            unitsPriceRange,
            unitsSpaceRange,
            reverseUnits,
            saledUnits,
            avaliableUnits,
        };
    }
    static async getUnitById(id) {
        return await Unit_model_1.Unit.findOne({
            where: { id },
            relations: {
                floors: true,
                category: true,
                project: true,
            },
            order: {
                floors: {
                    index: "asc",
                },
            },
        });
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
        unit.position = [data.position_x, data.position_y];
        // if (data.video) unit.videoUrl = data.video;
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
    static async setUnitStatus(id, status, translate) {
        const unit = await Unit_model_1.Unit.findOneBy({ id });
        if (!unit) {
            throw new ApiError_1.default(translate("unit-not-found"), 404);
        }
        unit.status = status;
        await unit.save();
        return unit;
    }
    static async reserveUnit({ unitId, intresetId, translate, }) {
        const unit = await this.getUnitById(unitId);
        if (!unit) {
            throw new ApiError_1.default(translate("unit-not-found"), 400);
        }
        if (unit.status !== UnitValidator_1.UnitStatus.avaliable) {
            throw new ApiError_1.default(translate("unit-not-avaliable"), 400);
        }
        const intreset = await unitIntreset_service_1.UnitInterestService.getUnitInterestById(intresetId, translate);
        if (!intreset) {
            throw new ApiError_1.default(translate("user-intreseted-not-found"), 400);
        }
        unit.status = UnitValidator_1.UnitStatus.reserved;
        intreset.status = UnitValidator_1.UnitIntresetStatus.reserve;
        intreset.reversePrice = unit.price;
        await unit.save();
        await intreset.save();
        return unit;
    }
    static async buyUnit({ unitId, intresetId, translate, }) {
        const unit = await this.getUnitById(unitId);
        if (!unit) {
            throw new ApiError_1.default(translate("unit-not-found"), 400);
        }
        if (unit.status === UnitValidator_1.UnitStatus.saled) {
            throw new ApiError_1.default(translate("unit-not-avaliable"), 400);
        }
        const intreset = await unitIntreset_service_1.UnitInterestService.getUnitInterestById(intresetId, translate);
        if (!intreset) {
            throw new ApiError_1.default(translate("user-intreseted-not-found"), 400);
        }
        if (intreset.id !== intresetId) {
            throw new ApiError_1.default(translate("unit-not-avaliable"), 400);
        }
        unit.status = UnitValidator_1.UnitStatus.saled;
        intreset.status = UnitValidator_1.UnitIntresetStatus.buy;
        intreset.buyPrice = unit.price;
        await unit.save();
        await intreset.save();
        return unit;
    }
    static async changeUnitsStatusByNumbers({ numbers, status, }) {
        await Unit_model_1.Unit.createQueryBuilder("unit")
            .update(Unit_model_1.Unit)
            .set({ status })
            .where("number IN (:...numbers)", { numbers })
            .execute();
    }
}
exports.UnitService = UnitService;
