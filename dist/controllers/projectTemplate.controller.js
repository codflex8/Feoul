"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTemplateController = void 0;
const ProjectTemplate_model_1 = require("../entities/ProjectTemplate.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
class ProjectTemplateController {
    static async createProjectTemplate(req, res) {
        try {
            const { name, number, link, status } = req.body;
            // const project = await Project.findOneBy({ id: projectId });
            // if (!project) {
            //   throw new ApiError(req.t("project-not-found"), 400);
            // }
            const projectTemplate = ProjectTemplate_model_1.ProjectTemplate.create({
                name,
                number,
                link,
                status,
            });
            await projectTemplate.save();
            res.status(201).json(projectTemplate);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectTemplates(req, res) {
        try {
            const { page, pageSize, name, number, status } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = ProjectTemplate_model_1.ProjectTemplate.createQueryBuilder("projectTemplate");
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
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, projectTemplates));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectTemplateById(req, res) {
        try {
            const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({
                id: req.params.id,
            });
            if (!projectTemplate) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(projectTemplate);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateProjectTemplate(req, res) {
        try {
            const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({
                id: req.params.id,
            });
            // const project = await Project.findOneBy({ id: req.body.projectId });
            // if (!project) {
            //   throw new ApiError(req.t("project-not-found"), 400);
            // }
            if (!projectTemplate) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            Object.assign(projectTemplate, req.body);
            // projectTemplate.project = project;
            await projectTemplate.save();
            res.status(200).json(projectTemplate);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteProjectTemplate(req, res) {
        try {
            const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({
                id: req.params.id,
            });
            if (!projectTemplate) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            await projectTemplate.softRemove();
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ProjectTemplateController = ProjectTemplateController;
