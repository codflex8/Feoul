import { Request, Response } from "express";
import { ProjectFacilities } from "../entities/ProjectFacilities.model";
import { Project } from "../entities/Project.model";
import ApiError from "../utils/ApiError";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ProjectFacilitesType } from "../utils/validators/ProjectValidator";
import { BaseQuery } from "../utils/types/types";

export class ProjectFacilitiesController {
  static async createProjectFacilities(
    req: Request<{}, {}, ProjectFacilitesType>,
    res: Response
  ): Promise<void> {
    try {
      const { name, lat, lng, projectId } = req.body;
      const project = await Project.findOneBy({ id: projectId });
      if (!project) {
        throw new ApiError(req.t("project_not_found"), 400);
      }
      const projectFacilities = ProjectFacilities.create({
        name,
        lat,
        lng,
        project,
      });
      await projectFacilities.save();
      res.status(201).json(projectFacilities);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectFacilitiess(
    req: Request<{}, {}, {}, BaseQuery & ProjectFacilitesType>,
    res: Response
  ): Promise<void> {
    try {
      const { page, pageSize, name, projectId } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = ProjectFacilities.createQueryBuilder(
        "projectFacilities"
      ).leftJoin("projectFacilities.project", "project");
      if (name) {
        querable.andWhere("LOWER(projectFacilities.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (projectId) {
        querable.andWhere("project.id = :projectId", { projectId });
      }
      const [projectFacilitiess, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();
      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, projectFacilitiess));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProjectFacilitiesById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectFacilities = await ProjectFacilities.findOneBy({
        id: req.params.id,
      });
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
      const projectFacilities = await ProjectFacilities.findOneBy({
        id: req.params.id,
      });
      const project = await Project.findOneBy({ id: req.body.projectId });
      if (!project) {
        throw new ApiError(req.t("project_not_found"), 400);
      }
      if (!projectFacilities) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      Object.assign(projectFacilities, req.body);
      projectFacilities.project = project;
      await projectFacilities.save();
      res.status(200).json(projectFacilities);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProjectFacilities(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const projectFacilities = await ProjectFacilities.findOneBy({
        id: req.params.id,
      });
      if (!projectFacilities) {
        res.status(404).json({ message: req.t("not-found") });
        return;
      }
      await projectFacilities.softRemove();
      res
        .status(200)
        .json({ message: "ProjectFacilities deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
