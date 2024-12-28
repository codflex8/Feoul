"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_model_1 = require("../entities/Project.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const ProjectTemplate_model_1 = require("../entities/ProjectTemplate.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class ProjectController {
    // Create a new project
    static async createProject(req, res) {
        const { document, templateId, number } = req.body;
        try {
            const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({
                id: templateId,
            });
            if (!projectTemplate) {
                throw new ApiError_1.default(req.t("template-not-found"), 400);
            }
            const isNumberExist = await Project_model_1.Project.getItemByNumber(number);
            if (isNumberExist) {
                throw new ApiError_1.default(req.t("project-number-used"), 409);
            }
            const project = Project_model_1.Project.create({
                ...req.body,
                projectDocUrl: document,
            });
            project.template = projectTemplate;
            await project.save();
            res.status(201).json(project);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get all projects with optional filters
    static async getProjects(req, res) {
        try {
            const { name, number, status, city, page, pageSize, fromDate, toDate } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = Project_model_1.Project.createQueryBuilder("project").leftJoinAndSelect("project.units", "units");
            if (name) {
                querable.andWhere("LOWER(project.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                });
            }
            if (city) {
                querable.andWhere("LOWER(project.city) LIKE LOWER(:city)", {
                    city: `%${city}%`,
                });
            }
            if (number) {
                querable.andWhere("project.number = :number", {
                    number,
                });
            }
            if (status) {
                querable.andWhere("LOWER(project.status) = :LOWER(status)", {
                    status,
                });
            }
            if (fromDate) {
                querable.andWhere("project.createdAt >= :fromDate", {
                    fromDate,
                });
            }
            if (toDate) {
                querable.andWhere("project.createdAt <= :toDate", {
                    toDate,
                });
            }
            const [projects, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, projects));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Get a single project by ID
    static async getProjectById(req, res) {
        try {
            const project = await Project_model_1.Project.findOneBy({ id: req.params.id });
            if (!project) {
                res.status(404).json({ message: req.t("project-not-found") });
                return;
            }
            res.status(200).json(project);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Update a project by ID
    static async updateProject(req, res) {
        try {
            const { document, templateId, number } = req.body;
            const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({
                id: templateId,
            });
            if (!projectTemplate) {
                throw new ApiError_1.default(req.t("template-not-found"), 400);
            }
            const project = await Project_model_1.Project.findOneBy({ id: req.params.id });
            if (!project) {
                res.status(404).json({ message: req.t("project-not-found") });
                return;
            }
            const isNumberExist = await Project_model_1.Project.getItemByNumber(number);
            if (isNumberExist && isNumberExist.id !== project.id) {
                throw new ApiError_1.default(req.t("project-number-used"), 409);
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
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Delete a project by ID
    static async deleteProject(req, res) {
        try {
            const project = await Project_model_1.Project.findOneBy({ id: req.params.id });
            if (!project) {
                res.status(404).json({ message: req.t("project-not-found") });
                return;
            }
            await project.softRemove();
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ProjectController = ProjectController;
