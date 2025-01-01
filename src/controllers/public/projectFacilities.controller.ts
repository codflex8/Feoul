import { Request, Response } from "express";
import { BaseQuery } from "../../utils/types/types";
import { ProjectFacilitesType } from "../../utils/validators/ProjectValidator";
import { ProjectFacilitiesService } from "../../services/projectFacilities.service";
import { GenericResponse } from "../../utils/GenericResponse";

export class PublicFacilitiesController {
  public static async getProjectFacilitiess(
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
}
