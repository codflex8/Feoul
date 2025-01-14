"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitInterestService = void 0;
const UnitIntreset_model_1 = require("../entities/UnitIntreset.model");
const Unit_model_1 = require("../entities/Unit.model");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class UnitInterestService {
    static async createUnitInterest(data, translate) {
        const unit = await Unit_model_1.Unit.findOneBy({ id: data.unitId });
        if (!unit) {
            throw new ApiError_1.default(translate("unit-not-found"), 404);
        }
        const newUnitInterest = UnitIntreset_model_1.UnitIntreset.create(data);
        newUnitInterest.unit = unit;
        await newUnitInterest.save();
        return newUnitInterest;
    }
    static async getUnitInterests(query) {
        const { page, pageSize, unitId, firstName, lastName, area, phoneNumber, email, status, financial, } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({
            page: Number(page ?? 1),
            pageSize: Number(pageSize ?? 10),
        });
        const queryBuilder = UnitIntreset_model_1.UnitIntreset.createQueryBuilder("unitIntreset").leftJoinAndSelect("unitIntreset.unit", "unit");
        if (firstName) {
            queryBuilder.andWhere("LOWER(unitIntreset.firstName) LIKE LOWER(:firstName)", {
                firstName: `%${firstName}%`,
            });
        }
        if (lastName) {
            queryBuilder.andWhere("LOWER(unitIntreset.lastName) LIKE LOWER(:lastName)", {
                lastName: `%${lastName}%`,
            });
        }
        if (area) {
            queryBuilder.andWhere("unitIntreset.area = :area", { area });
        }
        if (phoneNumber) {
            queryBuilder.andWhere("unitIntreset.phoneNumber = :phoneNumber", {
                phoneNumber,
            });
        }
        if (email) {
            queryBuilder.andWhere("unitIntreset.email = :email", { email });
        }
        if (status) {
            queryBuilder.andWhere("LOWER(unitIntreset.status) = LOWER(:status)", {
                status,
            });
        }
        if (unitId) {
            queryBuilder.andWhere("unit.id = :unitId", { unitId });
        }
        if (financial) {
            queryBuilder
                .andWhere("(LOWER(unitIntreset.status) = LOWER(:reversedStatus) OR LOWER(unitIntreset.status) = LOWER(:saledStatus))", {
                reversedStatus: UnitValidator_1.UnitIntresetStatus.reserve.toString(),
                saledStatus: UnitValidator_1.UnitIntresetStatus.buy.toString(),
            })
                .select([
                "unitIntreset.id",
                "unitIntreset.firstName",
                "unitIntreset.lastName",
                "unitIntreset.phoneNumber",
                "unitIntreset.status",
                "unitIntreset.reversePrice",
                "unitIntreset.buyPrice",
                "unitIntreset.createdAt",
            ]);
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async getUnitInterestById(id, translate) {
        const unitInterest = await UnitIntreset_model_1.UnitIntreset.findOneBy({ id });
        if (!unitInterest) {
            throw new ApiError_1.default(translate("unit-interest-not-found"), 404);
        }
        return unitInterest;
    }
    static async updateUnitInterest(id, data, translate) {
        const unitInterest = await UnitIntreset_model_1.UnitIntreset.findOneBy({ id });
        if (!unitInterest) {
            throw new ApiError_1.default(translate("unit-interest-not-found"), 404);
        }
        if (data.unitId) {
            const unit = await Unit_model_1.Unit.findOneBy({ id: data.unitId });
            if (!unit) {
                throw new ApiError_1.default(translate("unit-not-found"), 404);
            }
            unitInterest.unit = unit;
        }
        Object.assign(unitInterest, data);
        await unitInterest.save();
        return unitInterest;
    }
    static async deleteUnitInterest(id, translate) {
        const unitInterest = await UnitIntreset_model_1.UnitIntreset.findOneBy({ id });
        if (!unitInterest) {
            throw new ApiError_1.default(translate("unit-interest-not-found"), 404);
        }
        await unitInterest.softRemove();
        return unitInterest;
    }
}
exports.UnitInterestService = UnitInterestService;
