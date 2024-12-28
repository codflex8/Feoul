import { TFunction } from "i18next";
import { Unit } from "../entities/Unit.model";
import { Project } from "../entities/Project.model";
import { UnitCategories } from "../entities/UnitCategories.model";
import { UnitType } from "../utils/validators/UnitValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

interface GetUnitsQuery {
  page: number;
  pageSize: number;
  priceFrom?: number;
  priceTo?: number;
  name?: string;
  number?: number;
  status?: string;
  projectId?: string;
  categoryId?: string;
}

export class UnitService {
  static async createUnit(
    data: { video: string } & UnitType,
    translate: TFunction
  ) {
    const { video, projectId, categoryId, number } = data;

    const isNumberExist = await Unit.getItemByNumber(number);
    if (isNumberExist) {
      throw new ApiError(translate("unit-number-used"), 409);
    }

    const project = await Project.findOneBy({ id: projectId });
    if (!project) {
      throw new ApiError(translate("project_not_found"), 400);
    }

    const category = await UnitCategories.findOneBy({ id: categoryId });
    if (!category) {
      throw new ApiError(translate("category_not_found"), 400);
    }

    const unit = Unit.create({
      ...data,
      videoUrl: video,
      project,
      category,
    });
    await unit.save();
    return unit;
  }

  static async getUnits(query: GetUnitsQuery) {
    const {
      page,
      pageSize,
      name,
      number,
      status,
      priceFrom,
      priceTo,
      projectId,
      categoryId,
    } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = Unit.createQueryBuilder("unit")
      .leftJoin("unit.project", "project")
      .leftJoinAndSelect("unit.category", "category");

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

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async getUnitById(id: string) {
    return await Unit.findOneBy({ id });
  }

  static async updateUnit(id: string, data: UnitType, translate: TFunction) {
    const unit = await Unit.findOneBy({ id });
    if (!unit) {
      throw new ApiError(translate("not-found"), 404);
    }

    const isNumberExist = await Unit.getItemByNumber(data.number);
    if (isNumberExist && isNumberExist.id !== unit.id) {
      throw new ApiError(translate("unit-number-used"), 409);
    }

    const project = await Project.findOneBy({ id: data.projectId });
    if (!project) {
      throw new ApiError(translate("project_not_found"), 400);
    }

    const category = await UnitCategories.findOneBy({ id: data.categoryId });
    if (!category) {
      throw new ApiError(translate("category_not_found"), 400);
    }

    Object.assign(unit, data);
    unit.category = category;
    unit.project = project;
    await unit.save();
    return unit;
  }

  static async deleteUnit(id: string, translate: TFunction) {
    const unit = await Unit.findOneBy({ id });
    if (!unit) {
      throw new ApiError(translate("not-found"), 404);
    }
    await unit.softRemove();
    return unit;
  }
}
