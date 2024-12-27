"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitFloorController = void 0;
const UnitFloor_model_1 = require("../entities/UnitFloor.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Unit_model_1 = require("../entities/Unit.model");
class UnitFloorController {
    // Create a new unit category
    static async createUnitFloor(req, res) {
        try {
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.body.unitId });
            if (!unit) {
                throw new ApiError_1.default("unit not found", 404);
            }
            const newUnitFloor = UnitFloor_model_1.UnitFloor.create(req.body);
            await newUnitFloor.save();
            res.status(201).json(newUnitFloor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all unit categories with optional filters
    static async getUnitFloor(req, res) {
        try {
            const { page, pageSize, name, index, unitId } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = UnitFloor_model_1.UnitFloor.createQueryBuilder("unitFloor").leftJoin("unitFloor.unit", "unit");
            if (name) {
                querable.andWhere("LOWER(unitFloor.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                });
            }
            if (index) {
                querable.andWhere("unitFloor.index = :index", {
                    index,
                });
            }
            if (unitId) {
                querable.andWhere("unit.id = :unitId", { unitId });
            }
            const [unitFloors, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, unitFloors));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single unit category by ID
    static async getUnitFloorById(req, res) {
        try {
            const unitFloor = await UnitFloor_model_1.UnitFloor.findOneBy({
                id: req.params.id,
            });
            if (!unitFloor) {
                res.status(404).json({ message: "Unit Floor not found" });
                return;
            }
            res.status(200).json(unitFloor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a unit category by ID
    static async updateUnitFloor(req, res) {
        try {
            const { image } = req.body;
            const unitFloor = await UnitFloor_model_1.UnitFloor.findOneBy({
                id: req.params.id,
            });
            if (!unitFloor) {
                res.status(404).json({ message: "Unit Floor not found" });
                return;
            }
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.body.unitId });
            if (!unit) {
                throw new ApiError_1.default("unit not found", 404);
            }
            Object.assign(unitFloor, req.body);
            if (image) {
                unitFloor.imageUrl = image;
            }
            unitFloor.unit = unit;
            await unitFloor.save();
            res.status(200).json(unitFloor);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a unit category by ID
    static async deleteUnitFloor(req, res) {
        try {
            const unitFloor = await UnitFloor_model_1.UnitFloor.findOneBy({
                id: req.params.id,
            });
            if (!unitFloor) {
                res.status(404).json({ message: "Unit Floor not found" });
                return;
            }
            await unitFloor.softRemove();
            res.status(200).json({ message: "Unit Floor deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UnitFloorController = UnitFloorController;
