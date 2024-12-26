import { Request, Response } from "express";
import { Project } from "../entities/Project.model";
import { ProjectType } from "../utils/validators/ProjectValidator";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ProjectTemplate } from "../entities/ProjectTemplate.model";
import ApiError from "../utils/ApiError";

export class ProjectController {
  // Create a new project
  static async createProject(
    req: Request<{}, {}, { document: string } & ProjectType>,
    res: Response
  ): Promise<void> {
    const { document, templateId } = req.body;
    try {
      const projectTemplate = await ProjectTemplate.findOneBy({
        id: templateId,
      });
      if (!projectTemplate) {
        throw new ApiError(req.t("template-not-found"), 400);
      }
      const project = Project.create({
        ...req.body,
        projectDocUrl: document,
      });
      project.template = projectTemplate;
      await project.save();
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all projects with optional filters
  static async getProjects(
    req: Request<{}, {}, {}, ProjectType & { page: number; pageSize: number }>,
    res: Response
  ): Promise<void> {
    try {
      const { name, number, status, city, page, pageSize } = req.query;
      const { skip, take } = getPaginationData({ page, pageSize });
      const querable = Project.createQueryBuilder("project").leftJoinAndSelect(
        "project.units",
        "units"
      );
      if (name) {
        querable.where("LOWER(project.name) LIKE LOWER(:name)", {
          name: `%${name}%`,
        });
      }
      if (city) {
        querable.where("LOWER(project.city) LIKE LOWER(:city)", {
          city: `%${city}%`,
        });
      }
      if (number) {
        querable.where("project.number = :number", {
          number,
        });
      }
      if (status) {
        querable.where("LOWER(project.status) = :LOWER(status)", {
          status,
        });
      }
      const [projects, count] = await querable
        .skip(skip)
        .take(take)
        .getManyAndCount();

      res
        .status(200)
        .json(new GenericResponse(page, pageSize, count, projects));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a single project by ID
  static async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const project = await Project.findOneBy({ id: req.params.id });
      if (!project) {
        res.status(404).json({ message: req.t("project-not-found") });
        return;
      }
      res.status(200).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a project by ID
  static async updateProject(
    req: Request<{ id: string }, {}, { document: string } & ProjectType>,
    res: Response
  ): Promise<void> {
    try {
      const { document, templateId } = req.body;
      const projectTemplate = await ProjectTemplate.findOneBy({
        id: templateId,
      });
      if (!projectTemplate) {
        throw new ApiError(req.t("template-not-found"), 400);
      }
      const project = await Project.findOneBy({ id: req.params.id });
      if (!project) {
        res.status(404).json({ message: req.t("project-not-found") });
        return;
      }
      project.name = req.body.name;
      project.number = req.body.number;
      project.status = req.body.status;
      project.projectDocUrl = req.body.projectDocUrl;
      project.city = req.body.city;
      project.lng = req.body.lng;
      project.lat = req.body.lat;
      if (document) {
        project.projectDocUrl = document;
      }
      project.template = projectTemplate;
      project.save();
      res.status(200).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a project by ID
  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await Project.findOneBy({ id: req.params.id });
      if (!project) {
        res.status(404).json({ message: req.t("project-not-found") });
        return;
      }
      await project.softRemove();
      res.status(200).json({ message: req.t("delete-success") });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
