"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const project_service_1 = require("../../services/project.service");
class ProjectController {
    static async createProject(req, res) {
        try {
            const project = await project_service_1.ProjectService.createProject(req.body, req.t);
            res.status(201).json(project);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getProjects(req, res) {
        try {
            const [projects, count] = await project_service_1.ProjectService.getProjects(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, projects));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectById(req, res) {
        try {
            const project = await project_service_1.ProjectService.getProjectById(req.params.id);
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
    static async updateProject(req, res) {
        try {
            const project = await project_service_1.ProjectService.updateProject(req.params.id, req.body, req.t);
            res.status(200).json(project);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteProject(req, res) {
        try {
            await project_service_1.ProjectService.deleteProject(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.ProjectController = ProjectController;
