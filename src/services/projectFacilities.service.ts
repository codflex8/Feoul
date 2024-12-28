import { TFunction } from "i18next";
import { ProjectFacilities } from "../entities/ProjectFacilities.model";
import { Project } from "../entities/Project.model";
import { ProjectFacilitesType } from "../utils/validators/ProjectValidator";
import { BaseQuery } from "../utils/types/types";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

export class ProjectFacilitiesService {
  static async createProjectFacilities(
    data: ProjectFacilitesType,
    translate: TFunction
  ) {
    const { name, lat, lng, projectId } = data;
    const project = await Project.findOneBy({ id: projectId });
    if (!project) {
      throw new ApiError(translate("project_not_found"), 400);
    }

    const projectFacilities = ProjectFacilities.create({
      name,
      lat,
      lng,
      project,
    });
    await projectFacilities.save();
    return projectFacilities;
  }

  static async getProjectFacilities(query: BaseQuery & ProjectFacilitesType) {
    const { page, pageSize, name, projectId } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = ProjectFacilities.createQueryBuilder(
      "projectFacilities"
    ).leftJoin("projectFacilities.project", "project");

    if (name) {
      queryBuilder.andWhere("LOWER(projectFacilities.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }
    if (projectId) {
      queryBuilder.andWhere("project.id = :projectId", { projectId });
    }

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async getProjectFacilitiesById(id: string) {
    return await ProjectFacilities.findOneBy({ id });
  }

  static async updateProjectFacilities(
    id: string,
    data: ProjectFacilitesType,
    translate: TFunction
  ) {
    const projectFacilities = await ProjectFacilities.findOneBy({ id });
    if (!projectFacilities) {
      throw new ApiError(translate("not-found"), 404);
    }

    const project = await Project.findOneBy({ id: data.projectId });
    if (!project) {
      throw new ApiError(translate("project_not_found"), 400);
    }

    Object.assign(projectFacilities, data);
    projectFacilities.project = project;
    await projectFacilities.save();
    return projectFacilities;
  }

  static async deleteProjectFacilities(id: string, translate: TFunction) {
    const projectFacilities = await ProjectFacilities.findOneBy({ id });
    if (!projectFacilities) {
      throw new ApiError(translate("not-found"), 404);
    }
    await projectFacilities.softRemove();
    return projectFacilities;
  }
}
