import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../../services/project.service";
import { GenericResponse } from "../../utils/GenericResponse";
import { ProjectType } from "../../utils/validators/ProjectValidator";
import { BaseQuery } from "../../utils/types/types";
import { CommonStatus } from "../../utils/types/enums";

export class PublicProjectController {
  public static async getProjects(
    req: Request<{}, {}, {}, ProjectType & BaseQuery>,
    res: Response
  ): Promise<void> {
    const [projects, count] = await ProjectService.getProjects({
      ...req.query,
      status: CommonStatus.posted,
    });
    res
      .status(200)
      .json(
        new GenericResponse(req.query.page, req.query.pageSize, count, projects)
      );
  }

  public static async getProjectById(req: Request, res: Response) {
    const project = await ProjectService.getProjectWithProjectData(
      req.params.id
    );
    if (!project) {
      res.status(404).json({ message: req.t("project-not-found") });
      return;
    }
    res.status(200).json(project);
  }
}
