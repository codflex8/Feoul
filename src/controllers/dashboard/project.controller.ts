import { Request, Response } from "express";
import { ProjectType } from "../../utils/validators/ProjectValidator";
import { BaseQuery } from "../../utils/types/types";
import { GenericResponse } from "../../utils/GenericResponse";
import { ProjectService } from "../../services/project.service";

export class ProjectController {
  static async createProject(
    req: Request<{}, {}, { document: string } & ProjectType>,
    res: Response
  ): Promise<void> {
    try {
      const project = await ProjectService.createProject(req.body, req.t);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async getProjects(
    req: Request<{}, {}, {}, ProjectType & BaseQuery>,
    res: Response
  ): Promise<void> {
    try {
      const [projects, count] = await ProjectService.getProjects(req.query);
      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            projects
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        res.status(404).json({ message: req.t("project-not-found") });
        return;
      }
      res.status(200).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProject(
    req: Request<{ id: string }, {}, { document: string } & ProjectType>,
    res: Response
  ): Promise<void> {
    try {
      const project = await ProjectService.updateProject(
        req.params.id,
        req.body,
        req.t
      );
      res.status(200).json(project);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      await ProjectService.deleteProject(req.params.id, req.t);
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
