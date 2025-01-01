"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicFacilitiesController = void 0;
const projectFacilities_service_1 = require("../../services/projectFacilities.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
class PublicFacilitiesController {
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
}
exports.PublicFacilitiesController = PublicFacilitiesController;
