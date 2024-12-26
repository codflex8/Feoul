import { Request, Response } from "express";
import { ProjectTemplate } from "../entities/ProjectTemplate.model";
import { Project } from "../entities/Project.model";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ProjectTemplateType } from "../utils/validators/ProjectTemplateValidator";

export class ProjectTemplateController {
  static async createProjectTemplate(
    req: Request<{}, {}, ProjectTemplateType>,
    res: Response
  ): Promise<void> {
    try {
      const { name, number, link, status, projectId } = req.body;
      const project = await Project.findOneBy({ id: projectId });
      if (!project) {
        throw new ApiError(req.t("project-not-found"), 400);
      }
      const projectTemplate = ProjectTemplate.create({
        name,
        number,
        link,
        status,
      });
      // await projectTemplate.save();
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
        querable.where("LOWER(projectTemplate.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (number) {
        querable.where("projectTemplate.number = :number", { number });
      }
      if (status) {
        querable.where("LOWER(projectTemplate.status) = LOWER(:status)", {
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
      const project = await Project.findOneBy({ id: req.body.projectId });
      if (!project) {
        throw new ApiError(req.t("project-not-found"), 400);
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
