import { TFunction } from "i18next";
import { UnitFloor } from "../entities/UnitFloor.model";
import { Unit } from "../entities/Unit.model";
import {
  unitCategoryFloorUpdateType,
  UnitFloorType,
} from "../utils/validators/UnitValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";
import { UnitCategories } from "../entities/UnitCategories.model";

interface GetFloorsQuery {
  page: number;
  pageSize: number;
  name?: string;
  index?: string;
  unitId?: string;
  categoryId: string;
}

export class UnitFloorService {
  static async updateUnitCategoryFloors(
    data: unitCategoryFloorUpdateType,
    translate: TFunction
  ) {
    const unitCategory = await UnitCategories.findOneBy({
      id: data.categoryId,
    });
    if (!unitCategory) {
      throw new ApiError(translate("unit-category-not-found"), 404);
    }
    await UnitFloor.createQueryBuilder()
      .update(UnitFloor)
      .set({ name: data.name, imageUrl: data.image, index: data.index })
      .where("id IN (:...unitFloorIds)", {
        unitFloorIds: await UnitFloor.createQueryBuilder("unitFloor")
          .select("unitFloor.id")
          .leftJoin("unitFloor.unit", "unit")
          .leftJoin("unit.category", "category")
          .where("category.id = :categoryId", { categoryId: data.categoryId })
          .andWhere("unitFloor.index = :index", { index: data.index })
          .getMany()
          .then((unitFloors) => unitFloors.map((uf) => uf.id)),
      })
      .execute();
  }

  static async addUnitCategoryFloors(
    data: unitCategoryFloorUpdateType,
    translate: TFunction
  ) {
    const unitCategory = await UnitCategories.findOneBy({
      id: data.categoryId,
    });
    if (!unitCategory) {
      throw new ApiError(translate("unit-category-not-found"), 404);
    }
    const units = await Unit.createQueryBuilder("unit")
      .leftJoin("unit.category", "category")
      .where("category.id = :categoryId", { categoryId: data.categoryId })
      .select("unit.id")
      .getMany();
    const addUnitsIds = units.map((unit) => unit.id);

    const newFloors = addUnitsIds.map((id) =>
      UnitFloor.create({
        imageUrl: data.image,
        name: data.name,
        index: data.index,
        unit: {
          id,
        },
      })
    );

    await UnitFloor.save(newFloors);
  }

  static async createUnitFloor(data: UnitFloorType, translate: TFunction) {
    const unit = await Unit.findOneBy({ id: data.unitId });
    if (!unit) {
      throw new ApiError(translate("unit-not-found"), 404);
    }

    const newUnitFloor = UnitFloor.create(data);
    newUnitFloor.unit = unit;
    newUnitFloor.imageUrl = data.image;
    await newUnitFloor.save();
    return newUnitFloor;
  }

  static async getUnitFloors(query: GetFloorsQuery) {
    const { page, pageSize, name, index, unitId, categoryId } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = UnitFloor.createQueryBuilder("unitFloor")
      .leftJoinAndSelect("unitFloor.unit", "unit")
      .leftJoinAndSelect("unit.category", "category");

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
    if (categoryId) {
      queryBuilder.andWhere("category.id = :categoryId", { categoryId });
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
