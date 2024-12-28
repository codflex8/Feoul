"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacilitiesService = void 0;
const ProjectFacilities_model_1 = require("../entities/ProjectFacilities.model");
const Project_model_1 = require("../entities/Project.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class ProjectFacilitiesService {
    static async createProjectFacilities(data, translate) {
        const { name, lat, lng, projectId } = data;
        const project = await Project_model_1.Project.findOneBy({ id: projectId });
        if (!project) {
            throw new ApiError_1.default(translate("project_not_found"), 400);
        }
        const projectFacilities = ProjectFacilities_model_1.ProjectFacilities.create({
            name,
            lat,
            lng,
            project,
        });
        await projectFacilities.save();
        return projectFacilities;
    }
    static async getProjectFacilities(query) {
        const { page, pageSize, name, projectId } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = ProjectFacilities_model_1.ProjectFacilities.createQueryBuilder("projectFacilities").leftJoin("projectFacilities.project", "project");
        if (name) {
            queryBuilder.andWhere("LOWER(projectFacilities.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (projectId) {
            queryBuilder.andWhere("project.id = :projectId", { projectId });
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async getProjectFacilitiesById(id) {
        return await ProjectFacilities_model_1.ProjectFacilities.findOneBy({ id });
    }
    static async updateProjectFacilities(id, data, translate) {
        const projectFacilities = await ProjectFacilities_model_1.ProjectFacilities.findOneBy({ id });
        if (!projectFacilities) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        const project = await Project_model_1.Project.findOneBy({ id: data.projectId });
        if (!project) {
            throw new ApiError_1.default(translate("project_not_found"), 400);
        }
        Object.assign(projectFacilities, data);
        projectFacilities.project = project;
        await projectFacilities.save();
        return projectFacilities;
    }
    static async deleteProjectFacilities(id, translate) {
        const projectFacilities = await ProjectFacilities_model_1.ProjectFacilities.findOneBy({ id });
        if (!projectFacilities) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        await projectFacilities.softRemove();
        return projectFacilities;
    }
}
exports.ProjectFacilitiesService = ProjectFacilitiesService;
