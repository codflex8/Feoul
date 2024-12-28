import { Request, Response } from "express";
import { ProjectFacilitesType } from "../../utils/validators/ProjectValidator";
import { BaseQuery } from "../../utils/types/types";
import { GenericResponse } from "../../utils/GenericResponse";
import { ProjectFacilitiesService } from "../../services/projectFacilities.service";

export class ProjectFacilitiesController {
  static async createProjectFacilities(
    req: Request<{}, {}, ProjectFacilitesType>,
    res: Response
  ): Promise<void> {
    try {
      const projectFacilities =
        await ProjectFacilitiesService.createProjectFacilities(req.body, req.t);
      res.status(201).json(projectFacilities);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async getProjectFacilitiess(
    req: Request<{}, {}, {}, BaseQuery & ProjectFacilitesType>,
    res: Response
  ): Promise<void> {
    try {
      const [projectFacilitiess, count] =
        await ProjectFacilitiesService.getProjectFacilities(req.query);
      res
        .status(200)
        .json(
          new GenericResponse(
            req.query.page,
            req.query.pageSize,
            count,
            projectFacilitiess
          )
        );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectFacilitiesById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectFacilities =
        await ProjectFacilitiesService.getProjectFacilitiesById(req.params.id);
      if (!projectFacilities) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      res.status(200).json(projectFacilities);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProjectFacilities(
    req: Request<{ id: string }, {}, ProjectFacilitesType>,
    res: Response
  ): Promise<void> {
    try {
      const projectFacilities =
        await ProjectFacilitiesService.updateProjectFacilities(
          req.params.id,
          req.body,
          req.t
        );
      res.status(200).json(projectFacilities);
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }

  static async deleteProjectFacilities(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await ProjectFacilitiesService.deleteProjectFacilities(
        req.params.id,
        req.t
      );
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(error?.statusCode || 400).json({ error: error.message });
    }
  }
}
