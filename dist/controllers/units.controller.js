"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitController = void 0;
const Unit_model_1 = require("../entities/Unit.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const Project_model_1 = require("../entities/Project.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
class UnitController {
    // Create a new unit
    static async createUnit(req, res) {
        try {
            const { video, projectId, categoryId } = req.body;
            const project = await Project_model_1.Project.findOneBy({ id: projectId });
            if (!project) {
                throw new ApiError_1.default(req.t("project_not_found"), 400);
            }
            const category = await UnitCategories_model_1.UnitCategories.findOneBy({ id: categoryId });
            if (!category) {
                throw new ApiError_1.default(req.t("category_not_found"), 400);
            }
            const unit = Unit_model_1.Unit.create({
                ...req.body,
                videoUrl: video,
                project,
                category,
            });
            await unit.save();
            res.status(201).json(unit);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all units with optional filters
    static async getUnits(req, res) {
        try {
            const { page, pageSize, name, number, status, priceFrom, priceTo, projectId, categoryId, } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = Unit_model_1.Unit.createQueryBuilder("unit")
                .leftJoin("unit.project", "project")
                .leftJoinAndSelect("unit.category", "category");
            if (categoryId) {
                querable.andWhere("category.id = :categoryId", {
                    categoryId,
                });
            }
            if (projectId) {
                querable.andWhere("project.id = :projectId", {
                    projectId,
                });
            }
            if (name) {
                querable.andWhere("LOWER(unit.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                });
            }
            if (number) {
                querable.andWhere("unit.number = :number", {
                    number,
                });
            }
            if (status) {
                querable.andWhere("LOWER(unit.status) = :LOWER(status)", {
                    status,
                });
            }
            if (priceFrom) {
                querable.andWhere("unit.price >= :priceFrom", {
                    priceFrom,
                });
            }
            if (priceTo) {
                querable.andWhere("unit.price <= :priceTo", {
                    priceTo,
                });
            }
            const [units, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res.status(200).json(new GenericResponse_1.GenericResponse(page, pageSize, count, units));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single unit by ID
    static async getUnitById(req, res) {
        try {
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.params.id });
            if (!unit) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(unit);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a unit by ID
    static async updateUnit(req, res) {
        try {
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.params.id });
            if (!unit) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            const project = await Project_model_1.Project.findOneBy({ id: req.body.projectId });
            if (!project) {
                throw new ApiError_1.default(req.t("project_not_found"), 400);
            }
            const category = await UnitCategories_model_1.UnitCategories.findOneBy({
                id: req.body.categoryId,
            });
            if (!category) {
                throw new ApiError_1.default(req.t("category_not_found"), 400);
            }
            Object.assign(unit, req.body);
            unit.category = category;
            unit.project = project;
            await unit.save();
            res.status(200).json(unit);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a unit by ID
    static async deleteUnit(req, res) {
        try {
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.params.id });
            if (!unit) {
                res.status(404).json({ message: "Unit not found" });
                return;
            }
            await unit.softRemove();
            res.status(200).json({ message: "Unit deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UnitController = UnitController;
