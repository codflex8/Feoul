"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicProjectController = void 0;
const project_service_1 = require("../../services/project.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
const enums_1 = require("../../utils/types/enums");
class PublicProjectController {
    static async getProjects(req, res) {
        const [projects, count] = await project_service_1.ProjectService.getProjects({
            ...req.query,
            status: enums_1.CommonStatus.posted,
        });
        res
            .status(200)
            .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, projects));
    }
    static async getProjectById(req, res) {
        const project = await project_service_1.ProjectService.getProjectWithProjectData(req.params.id);
        if (!project) {
            res.status(404).json({ message: req.t("project-not-found") });
            return;
        }
        res.status(200).json(project);
    }
}
exports.PublicProjectController = PublicProjectController;
