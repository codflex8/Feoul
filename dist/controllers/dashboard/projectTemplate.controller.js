"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTemplateController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const projectTemplate_service_1 = require("../../services/projectTemplate.service");
class ProjectTemplateController {
    static async createProjectTemplate(req, res) {
        try {
            const projectTemplate = await projectTemplate_service_1.ProjectTemplateService.createProjectTemplate(req.body, req.t);
            res.status(201).json(projectTemplate);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getProjectTemplates(req, res) {
        try {
            const [projectTemplates, count] = await projectTemplate_service_1.ProjectTemplateService.getProjectTemplates(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, projectTemplates));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectTemplateById(req, res) {
        try {
            const projectTemplate = await projectTemplate_service_1.ProjectTemplateService.getProjectTemplateById(req.params.id);
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
            const projectTemplate = await projectTemplate_service_1.ProjectTemplateService.updateProjectTemplate(req.params.id, req.body, req.t);
            res.status(200).json(projectTemplate);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteProjectTemplate(req, res) {
        try {
            await projectTemplate_service_1.ProjectTemplateService.deleteProjectTemplate(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.ProjectTemplateController = ProjectTemplateController;
