"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacilitiesController = void 0;
const GenericResponse_1 = require("../../utils/GenericResponse");
const projectFacilities_service_1 = require("../../services/projectFacilities.service");
class ProjectFacilitiesController {
    static async createProjectFacilities(req, res) {
        try {
            const projectFacilities = await projectFacilities_service_1.ProjectFacilitiesService.createProjectFacilities(req.body, req.t);
            res.status(201).json(projectFacilities);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async getProjectFacilitiess(req, res) {
        try {
            const [projectFacilitiess, count] = await projectFacilities_service_1.ProjectFacilitiesService.getProjectFacilities(req.query);
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, projectFacilitiess));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectFacilitiesById(req, res) {
        try {
            const projectFacilities = await projectFacilities_service_1.ProjectFacilitiesService.getProjectFacilitiesById(req.params.id);
            if (!projectFacilities) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            res.status(200).json(projectFacilities);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateProjectFacilities(req, res) {
        try {
            const projectFacilities = await projectFacilities_service_1.ProjectFacilitiesService.updateProjectFacilities(req.params.id, req.body, req.t);
            res.status(200).json(projectFacilities);
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
    static async deleteProjectFacilities(req, res) {
        try {
            await projectFacilities_service_1.ProjectFacilitiesService.deleteProjectFacilities(req.params.id, req.t);
            res.status(200).json({ message: req.t("delete-success") });
        }
        catch (error) {
            res.status(error?.statusCode || 400).json({ error: error.message });
        }
    }
}
exports.ProjectFacilitiesController = ProjectFacilitiesController;
