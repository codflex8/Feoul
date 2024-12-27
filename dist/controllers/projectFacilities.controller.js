"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacilitiesController = void 0;
const ProjectFacilities_model_1 = require("../entities/ProjectFacilities.model");
const Project_model_1 = require("../entities/Project.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
class ProjectFacilitiesController {
    static async createProjectFacilities(req, res) {
        try {
            const { name, lat, lng, projectId } = req.body;
            const project = await Project_model_1.Project.findOneBy({ id: projectId });
            if (!project) {
                throw new ApiError_1.default(req.t("project_not_found"), 400);
            }
            const projectFacilities = ProjectFacilities_model_1.ProjectFacilities.create({
                name,
                lat,
                lng,
                project,
            });
            await projectFacilities.save();
            res.status(201).json(projectFacilities);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectFacilitiess(req, res) {
        try {
            const { page, pageSize, name, projectId } = req.query;
            const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
            const querable = ProjectFacilities_model_1.ProjectFacilities.createQueryBuilder("projectFacilities").leftJoin("projectFacilities.project", "project");
            if (name) {
                querable.where("LOWER(projectFacilities.name) LIKE LOWER(:name)", {
                    name: `%${name}%`,
                });
            }
            if (projectId) {
                querable.where("project.id = :projectId", { projectId });
            }
            const [projectFacilitiess, count] = await querable
                .skip(skip)
                .take(take)
                .getManyAndCount();
            res
                .status(200)
                .json(new GenericResponse_1.GenericResponse(page, pageSize, count, projectFacilitiess));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getProjectFacilitiesById(req, res) {
        try {
            const projectFacilities = await ProjectFacilities_model_1.ProjectFacilities.findOneBy({
                id: req.params.id,
            });
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
            const projectFacilities = await ProjectFacilities_model_1.ProjectFacilities.findOneBy({
                id: req.params.id,
            });
            const project = await Project_model_1.Project.findOneBy({ id: req.body.projectId });
            if (!project) {
                throw new ApiError_1.default(req.t("project_not_found"), 400);
            }
            if (!projectFacilities) {
                res.status(404).json({ message: req.t("not-found") });
                return;
            }
            Object.assign(projectFacilities, req.body);
            projectFacilities.project = project;
            await projectFacilities.save();
            res.status(200).json(projectFacilities);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteProjectFacilities(req, res) {
        try {
            const projectFacilities = await ProjectFacilities_model_1.ProjectFacilities.findOneBy({
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
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ProjectFacilitiesController = ProjectFacilitiesController;
