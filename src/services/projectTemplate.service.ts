import { TFunction } from "i18next";
import { ProjectTemplate } from "../entities/ProjectTemplate.model";
import { ProjectTemplateType } from "../utils/validators/ProjectTemplateValidator";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";

interface GetTemplatesQuery {
  page: number;
  pageSize: number;
  name?: string;
  number?: number;
  status?: string;
}

export class ProjectTemplateService {
  static async createProjectTemplate(
    data: ProjectTemplateType,
    translate: TFunction
  ) {
    const { number } = data;
    const isTemplateExist = await ProjectTemplate.getItemByNumber(number);
    if (isTemplateExist) {
      throw new ApiError(translate("template-number-used"), 409);
    }

    const projectTemplate = ProjectTemplate.create({ ...data });
    await projectTemplate.save();
    return projectTemplate;
  }

  static async getProjectTemplates(query: GetTemplatesQuery) {
    const { page, pageSize, name, number, status } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const queryBuilder = ProjectTemplate.createQueryBuilder("projectTemplate");

    if (name) {
      queryBuilder.andWhere("LOWER(projectTemplate.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }
    if (number) {
      queryBuilder.andWhere("projectTemplate.number = :number", { number });
    }
    if (status) {
      queryBuilder.andWhere("LOWER(projectTemplate.status) = LOWER(:status)", {
        status,
      });
    }

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }

  static async getProjectTemplateById(id: string) {
    return await ProjectTemplate.findOneBy({ id });
  }

  static async updateProjectTemplate(
    id: string,
    data: ProjectTemplateType,
    translate: TFunction
  ) {
    const projectTemplate = await ProjectTemplate.findOneBy({ id });
    if (!projectTemplate) {
      throw new ApiError(translate("not-found"), 404);
    }

    const isTemplateExist = await ProjectTemplate.getItemByNumber(data.number);
    if (isTemplateExist && isTemplateExist.id !== projectTemplate.id) {
      throw new ApiError(translate("template-number-used"), 409);
    }

    Object.assign(projectTemplate, data);
    await projectTemplate.save();
    return projectTemplate;
  }

  static async deleteProjectTemplate(id: string, translate: TFunction) {
    const projectTemplate = await ProjectTemplate.findOneBy({ id });
    if (!projectTemplate) {
      throw new ApiError(translate("not-found"), 404);
    }
    await projectTemplate.softRemove();
    return projectTemplate;
  }
}
