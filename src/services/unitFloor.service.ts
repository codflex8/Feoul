import { TFunction } from "i18next";
import { UnitFloor } from "../entities/UnitFloor.model";
import { Unit } from "../entities/Unit.model";
import { UnitFloorType } from "../utils/validators/UnitValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

interface GetFloorsQuery {
  page: number;
  pageSize: number;
  name?: string;
  index?: string;
  unitId?: string;
}

export class UnitFloorService {
  static async createUnitFloor(data: UnitFloorType, translate: TFunction) {
    const unit = await Unit.findOneBy({ id: data.unitId });
    if (!unit) {
      throw new ApiError(translate("unit-not-found"), 404);
    }

    const newUnitFloor = UnitFloor.create(data);
    newUnitFloor.unit = unit;
    await newUnitFloor.save();
    return newUnitFloor;
  }

  static async getUnitFloors(query: GetFloorsQuery) {
    const { page, pageSize, name, index, unitId } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = UnitFloor.createQueryBuilder(
      "unitFloor"
    ).leftJoinAndSelect("unitFloor.unit", "unit");

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

  static async getUnitFloorById(id: string) {
    return await UnitFloor.findOneBy({ id });
  }

  static async updateUnitFloor(
    id: string,
    data: Partial<UnitFloorType>,
    translate: TFunction
  ) {
    const unitFloor = await UnitFloor.findOneBy({ id });
    if (!unitFloor) {
      throw new ApiError(translate("unit-floor-not-found"), 404);
    }

    if (data.unitId) {
      const unit = await Unit.findOneBy({ id: data.unitId });
      if (!unit) {
        throw new ApiError(translate("unit-not-found"), 404);
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

  static async deleteUnitFloor(id: string, translate: TFunction) {
    const unitFloor = await UnitFloor.findOneBy({ id });
    if (!unitFloor) {
      throw new ApiError(translate("unit-floor-not-found"), 404);
    }
    await unitFloor.softRemove();
    return unitFloor;
  }
}
