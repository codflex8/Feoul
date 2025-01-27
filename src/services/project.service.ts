import { TFunction } from "i18next";
import { Project } from "../entities/Project.model";
import { ProjectType } from "../utils/validators/ProjectValidator";
import { BaseQuery } from "../utils/types/types";
import { ProjectTemplate } from "../entities/ProjectTemplate.model";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";
import { CommonStatus } from "../utils/types/enums";
import { Unit } from "../entities/Unit.model";
import { UnitService } from "./units.service";

export class ProjectService {
  static async createProject(
    data: { document: string } & ProjectType,
    translate: TFunction
  ) {
    const { document, templateId, number } = data;

    const projectTemplate = await ProjectTemplate.findOneBy({ id: templateId });

    const isNumberExist = await Project.getItemByNumber(number);
    if (isNumberExist) {
      throw new ApiError(translate("project-number-used"), 409);
    }

    const project = Project.create({
      ...data,
      projectDocUrl: document,
      lat: data.lat.toString(),
      lng: data.lng.toString(),
    });
    if (projectTemplate) {
      project.template = projectTemplate;
    }

    await project.save();
    return project;
  }

  static async getProjects(query: ProjectType & BaseQuery) {
    const { name, number, status, city, page, pageSize, fromDate, toDate } =
      query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = Project.createQueryBuilder("project").leftJoin(
      "project.units",
      "units"
    );

    if (name) {
      queryBuilder.andWhere("LOWER(project.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }
    if (city) {
      queryBuilder.andWhere("LOWER(project.city) LIKE LOWER(:city)", {
        city: `%${city}%`,
      });
    }
    if (number) {
      queryBuilder.andWhere("project.number = :number", { number });
    }
    if (status) {
      queryBuilder.andWhere("LOWER(project.status) = LOWER(:status)", {
        status,
      });
    }
    if (fromDate) {
      queryBuilder.andWhere("project.createdAt >= :fromDate", { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere("project.createdAt <= :toDate", { toDate });
    }

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async updateProject(
    id: string,
    data: { document: string } & ProjectType,
    translate: TFunction
  ) {
    const { document, templateId, number } = data;

    const projectTemplate = await ProjectTemplate.findOneBy({ id: templateId });
    if (!projectTemplate) {
      throw new ApiError(translate("template-not-found"), 400);
    }

    const project = await Project.findOneBy({ id });
    if (!project) {
      throw new ApiError(translate("project-not-found"), 404);
    }

    const isNumberExist = await Project.getItemByNumber(number);
    if (isNumberExist && isNumberExist.id !== project.id) {
      throw new ApiError(translate("project-number-used"), 409);
    }

    Object.assign(project, {
      ...data,
      lat: data.lat,
      lng: data.lng,
      projectDocUrl: document || project.projectDocUrl,
      template: projectTemplate,
    });

    await project.save();
    return project;
  }

  static async deleteProject(id: string, translate: TFunction) {
    const project = await Project.findOneBy({ id });
    if (!project) {
      throw new ApiError(translate("project-not-found"), 404);
    }
    await project.softRemove();
    return project;
  }

  static async getProjectById(id: string) {
    return await Project.findOne({
      where: { id },
      relations: {
        units: true,
        facilities: true,
        template: true,
      },
    });
  }

  static async getProjectWithProjectData(id: string) {
    const project = await Project.findOne({
      where: { id, status: CommonStatus.posted },
      relations: {
        // units: {
        //   floors: true,
        //   category: true,
        // },
        facilities: true,
        template: true,
      },
    });
    const projectUnitsData = await UnitService.getProjectUnitsGroupedByStatus(
      id
    );
    return { project, unitsData: projectUnitsData };
  }
}
