"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitIntresetController = void 0;
const UnitIntreset_model_1 = require("../entities/UnitIntreset.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Unit_model_1 = require("../entities/Unit.model");
class UnitIntresetController {
    // Create a new unit category
    static async createUnitIntreset(req, res) {
        try {
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.body.unitId });
            if (!unit) {
                throw new ApiError_1.default("unit not found", 404);
            }
            const newUnitIntreset = UnitIntreset_model_1.UnitIntreset.create(req.body);
            newUnitIntreset.unit = unit;
            await newUnitIntreset.save();
            res.status(201).json(newUnitIntreset);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all unit categories with optional filters
    static async getUnitIntreset(req, res) {
        try {
            const { page, pageSize, unitId, firstName, lastName, area, phoneNumber, email, status, } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({
                page: Number(page ?? 1),
                pageSize: Number(pageSize ?? 10),
            });
            const querable = UnitIntreset_model_1.UnitIntreset.createQueryBuilder("unitIntreset").leftJoinAndSelect("unitIntreset.unit", "unit");
            if (firstName) {
                querable.andWhere("LOWER(unitIntreset.firstName) LIKE LOWER(:firstName)", {
                    firstName: `%${firstName}%`,
                });
            }
            if (lastName) {
                querable.andWhere("LOWER(unitIntreset.lastName) LIKE LOWER(:lastName)", {
                    lastName: `%${lastName}%`,
                });
            }
            if (area) {
                querable.andWhere("unitIntreset.area = :area", {
                    area,
                });
            }
            if (phoneNumber) {
                querable.andWhere("unitIntreset.phoneNumber = :phoneNumber", {
                    phoneNumber,
                });
            }
            if (email) {
                querable.andWhere("unitIntreset.email = :email", {
                    email,
                });
            }
            if (status) {
                querable.andWhere("LOWER(unitIntreset.status) = LOWER(:status)", {
                    status,
                });
            }
            if (unitId) {
                querable.andWhere("unit.id = :unitId", { unitId });
            }
            const [unitIntresets, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(Number(page), Number(pageSize), count, unitIntresets));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single unit category by ID
    static async getUnitIntresetById(req, res) {
        try {
            const unitIntreset = await UnitIntreset_model_1.UnitIntreset.findOneBy({
                id: req.params.id,
            });
            if (!unitIntreset) {
                res.status(404).json({ message: "Unit Intreset not found" });
                return;
            }
            res.status(200).json(unitIntreset);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a unit category by ID
    static async updateUnitIntreset(req, res) {
        try {
            const unitIntreset = await UnitIntreset_model_1.UnitIntreset.findOneBy({
                id: req.params.id,
            });
            if (!unitIntreset) {
                res.status(404).json({ message: "Unit Intreset not found" });
                return;
            }
            const unit = await Unit_model_1.Unit.findOneBy({ id: req.body.unitId });
            if (!unit) {
                throw new ApiError_1.default("unit not found", 404);
            }
            Object.assign(unitIntreset, req.body);
            unitIntreset.unit = unit;
            await unitIntreset.save();
            res.status(200).json(unitIntreset);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a unit category by ID
    static async deleteUnitIntreset(req, res) {
        try {
            const unitIntreset = await UnitIntreset_model_1.UnitIntreset.findOneBy({
                id: req.params.id,
            });
            if (!unitIntreset) {
                res.status(404).json({ message: "Unit Intreset not found" });
                return;
            }
            await unitIntreset.softRemove();
            res.status(200).json({ message: "Unit Intreset deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.UnitIntresetController = UnitIntresetController;
