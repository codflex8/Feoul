import { Request, Response } from "express";
import { ProjectTemplateType } from "../../utils/validators/ProjectTemplateValidator";
import { GenericResponse } from "../../utils/GenericResponse";
import { ProjectTemplateService } from "../../services/projectTemplate.service";

export class ProjectTemplateController {
  static async createProjectTemplate(
    req: Request<{}, {}, ProjectTemplateType>,
    res: Response
  ): Promise<void> {
    try {
      const projectTemplate =
        await ProjectTemplateService.createProjectTemplate(req.body, req.t);
      res.status(201).json(projectTemplate);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
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
      const [projectTemplates, count] =
        await ProjectTemplateService.getProjectTemplates(req.query);
      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            projectTemplates
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectTemplateById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectTemplate =
        await ProjectTemplateService.getProjectTemplateById(req.params.id);
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
      const projectTemplate =
        await ProjectTemplateService.updateProjectTemplate(
          req.params.id,
          req.body,
          req.t
        );
      res.status(200).json(projectTemplate);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteProjectTemplate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await ProjectTemplateService.deleteProjectTemplate(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
