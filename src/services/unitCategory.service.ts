import { TFunction } from "i18next";
import { UnitCategories } from "../entities/UnitCategories.model";
import { UnitCategoryType } from "../utils/validators/UnitValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

interface GetCategoriesQuery {
  page: number;
  pageSize: number;
  name?: string;
  status?: string;
}

export class UnitCategoryService {
  static async createUnitCategory(
    data: UnitCategoryType,
    translate: TFunction
  ) {
    const isNumberExist = await UnitCategories.getItemByNumber(data.number);
    if (isNumberExist) {
      throw new ApiError(translate("unit-category-number-used"), 409);
    }
    const newUnitCategory = UnitCategories.create({ ...data });
    await newUnitCategory.save();
    return newUnitCategory;
  }

  static async getUnitCategories(query: GetCategoriesQuery) {
    const { page, pageSize, name, status } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = UnitCategories.createQueryBuilder("unitCategory");

    if (name) {
      queryBuilder.andWhere("LOWER(unitCategory.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }
    if (status) {
      queryBuilder.andWhere("LOWER(unitCategory.status) = LOWER(:status)", {
        status,
      });
    }

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async getUnitCategoryById(id: string) {
    return await UnitCategories.findOneBy({ id });
  }

  static async updateUnitCategory(
    id: string,
    data: UnitCategoryType,
    translate: TFunction
  ) {
    const unitCategory = await UnitCategories.findOneBy({ id });
    if (!unitCategory) {
      throw new ApiError(translate("not-found"), 404);
    }

    Object.assign(unitCategory, data);
    await unitCategory.save();
    return unitCategory;
  }

  static async deleteUnitCategory(id: string, translate: TFunction) {
    const unitCategory = await UnitCategories.findOneBy({ id });
    if (!unitCategory) {
      throw new ApiError(translate("not-found"), 404);
    }
    await unitCategory.softRemove();
    return unitCategory;
  }
}
