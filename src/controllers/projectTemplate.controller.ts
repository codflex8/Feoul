import { Request, Response } from "express";
import { ProjectTemplate } from "../entities/ProjectTemplate.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ProjectTemplateType } from "../utils/validators/ProjectTemplateValidator";
import ApiError from "../utils/ApiError";

export class ProjectTemplateController {
  static async createProjectTemplate(
    req: Request<{}, {}, ProjectTemplateType>,
    res: Response
  ): Promise<void> {
    try {
      const { name, number, link, status } = req.body;
      const isTemplateExist = await ProjectTemplate.getItemByNumber(number);
      if (isTemplateExist) {
        throw new ApiError(req.t("template-number-used"), 409);
      }
      const projectTemplate = ProjectTemplate.create({
        name,
        number,
        link,
        status,
      });
      await projectTemplate.save();
      res.status(201).json(projectTemplate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectTemplates(
    req: Request<
      {},
      {},
      {},
      {
        page: number;
        pageSize: number;
        name?: string;
        number?: number;
        status?: string;
      }
    >,
    res: Response
  ): Promise<void> {
    try {
      const { page, pageSize, name, number, status } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = ProjectTemplate.createQueryBuilder("projectTemplate");
      if (name) {
        querable.andWhere("LOWER(projectTemplate.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (number) {
        querable.andWhere("projectTemplate.number = :number", { number });
      }
      if (status) {
        querable.andWhere("LOWER(projectTemplate.status) = LOWER(:status)", {
          status,
        });
      }
      const [projectTemplates, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, projectTemplates));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectTemplateById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectTemplate = await ProjectTemplate.findOneBy({
        id: req.params.id,
      });
      if (!projectTemplate) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(projectTemplate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProjectTemplate(
    req: Request<{ id: string }, {}, ProjectTemplateType>,
    res: Response
  ): Promise<void> {
    try {
      const projectTemplate = await ProjectTemplate.findOneBy({
        id: req.params.id,
      });
      const isTemplateExist = await ProjectTemplate.getItemByNumber(
        req.body.number
      );
      if (isTemplateExist && isTemplateExist.id !== projectTemplate?.id) {
        throw new ApiError(req.t("template-number-used"), 409);
      }
      if (!projectTemplate) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      Object.assign(projectTemplate, req.body);
      // projectTemplate.project = project;
      await projectTemplate.save();
      res.status(200).json(projectTemplate);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProjectTemplate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectTemplate = await ProjectTemplate.findOneBy({
        id: req.params.id,
      });
      if (!projectTemplate) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      await projectTemplate.softRemove();
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
