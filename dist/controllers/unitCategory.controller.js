"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCategoryController = void 0;
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class UnitCategoryController {
    // Create a new unit category
    static async createUnitCategory(req, res) {
        try {
            const isNumberExist = await UnitCategories_model_1.UnitCategories.getItemByNumber(req.body.number);
            if (isNumberExist) {
                throw new ApiError_1.default(req.t("unit-category-number-used"), 409);
            }
            const newUnitCategory = UnitCategories_model_1.UnitCategories.create({ ...req.body });
            await newUnitCategory.save();
            res.status(201).json(newUnitCategory);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all unit categories with optional filters
    static async getUnitCategories(req, res) {
        try {
            const { page, pageSize, name, status } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = UnitCategories_model_1.UnitCategories.createQueryBuilder("unitCategory");
            if (name) {
                querable.andWhere("LOWER(unitCategory.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                });
            }
            if (status) {
                querable.andWhere("LOWER(unitCategory.status) = LOWER(:status)", {
                    status,
                });
            }
            const [unitCategories, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, unitCategories));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single unit category by ID
    static async getUnitCategoryById(req, res) {
        try {
            const unitCategory = await UnitCategories_model_1.UnitCategories.findOneBy({
                id: req.params.id,
            });
            if (!unitCategory) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(unitCategory);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a unit category by ID
    static async updateUnitCategory(req, res) {
        try {
            const unitCategory = await UnitCategories_model_1.UnitCategories.findOneBy({
                id: req.params.id,
            });
            if (!unitCategory) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            // const unit = await Unit.findOneBy({ id: req.body.unitId });
            // if (!unit) {
            //   throw new ApiError(req.t("unit-not-found"), 404);
            // }
            Object.assign(unitCategory, req.body);
            await unitCategory.save();
            res.status(200).json(unitCategory);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a unit category by ID
    static async deleteUnitCategory(req, res) {
        try {
            const unitCategory = await UnitCategories_model_1.UnitCategories.findOneBy({
                id: req.params.id,
            });
            if (!unitCategory) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            await unitCategory.softRemove();
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UnitCategoryController = UnitCategoryController;
