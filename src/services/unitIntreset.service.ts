import { TFunction } from "i18next";
import { UnitIntreset } from "../entities/UnitIntreset.model";
import { Unit } from "../entities/Unit.model";
import { UnitIntresetType } from "../utils/validators/UnitValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

interface GetInterestQuery {
  page?: number;
  pageSize?: number;
  unitId?: string;
  firstName?: string;
  lastName?: string;
  area?: string;
  phoneNumber?: string;
  email?: string;
  status?: string;
}

export class UnitInterestService {
  static async createUnitInterest(
    data: UnitIntresetType,
    translate: TFunction
  ) {
    const unit = await Unit.findOneBy({ id: data.unitId });
    if (!unit) {
      throw new ApiError(translate("unit-not-found"), 404);
    }

    const newUnitInterest = UnitIntreset.create(data);
    newUnitInterest.unit = unit;
    await newUnitInterest.save();
    return newUnitInterest;
  }

  static async getUnitInterests(query: GetInterestQuery) {
    const {
      page,
      pageSize,
      unitId,
      firstName,
      lastName,
      area,
      phoneNumber,
      email,
      status,
    } = query;
    const { skip, take } = getPaginationData({
      page: Number(page ?? 1),
      pageSize: Number(pageSize ?? 10),
    });

    const queryBuilder = UnitIntreset.createQueryBuilder(
      "unitIntreset"
    ).leftJoinAndSelect("unitIntreset.unit", "unit");

    if (firstName) {
      queryBuilder.andWhere(
        "LOWER(unitIntreset.firstName) LIKE LOWER(:firstName)",
        {
          firstName: `%${firstName}%`,
        }
      );
    }
    if (lastName) {
      queryBuilder.andWhere(
        "LOWER(unitIntreset.lastName) LIKE LOWER(:lastName)",
        {
          lastName: `%${lastName}%`,
        }
      );
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

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async getUnitInterestById(id: string, translate: TFunction) {
    const unitInterest = await UnitIntreset.findOneBy({ id });
    if (!unitInterest) {
      throw new ApiError(translate("unit-interest-not-found"), 404);
    }
    return unitInterest;
  }

  static async updateUnitInterest(
    id: string,
    data: Partial<UnitIntresetType>,
    translate: TFunction
  ) {
    const unitInterest = await UnitIntreset.findOneBy({ id });
    if (!unitInterest) {
      throw new ApiError(translate("unit-interest-not-found"), 404);
    }

    if (data.unitId) {
      const unit = await Unit.findOneBy({ id: data.unitId });
      if (!unit) {
        throw new ApiError(translate("unit-not-found"), 404);
      }
      unitInterest.unit = unit;
    }

    Object.assign(unitInterest, data);
    await unitInterest.save();
    return unitInterest;
  }

  static async deleteUnitInterest(id: string, translate: TFunction) {
    const unitInterest = await UnitIntreset.findOneBy({ id });
    if (!unitInterest) {
      throw new ApiError(translate("unit-interest-not-found"), 404);
    }
    await unitInterest.softRemove();
    return unitInterest;
  }
}
