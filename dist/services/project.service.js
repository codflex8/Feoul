"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const Project_model_1 = require("../entities/Project.model");
const ProjectTemplate_model_1 = require("../entities/ProjectTemplate.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
const enums_1 = require("../utils/types/enums");
const units_service_1 = require("./units.service");
class ProjectService {
    static async createProject(data, translate) {
        const { document, templateId, number } = data;
        const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({ id: templateId });
        if (!projectTemplate) {
            throw new ApiError_1.default(translate("template-not-found"), 400);
        }
        const isNumberExist = await Project_model_1.Project.getItemByNumber(number);
        if (isNumberExist) {
            throw new ApiError_1.default(translate("project-number-used"), 409);
        }
        const project = Project_model_1.Project.create({
            ...data,
            projectDocUrl: document,
        });
        project.template = projectTemplate;
        await project.save();
        return project;
    }
    static async getProjects(query) {
        const { name, number, status, city, page, pageSize, fromDate, toDate } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = Project_model_1.Project.createQueryBuilder("project").leftJoinAndSelect("project.units", "units");
        if (name) {
            queryBuilder.andWhere("LOWER(project.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (city) {
            queryBuilder.andWhere("LOWER(project.city) LIKE LOWER(:city)", {
                city: `%${city}%`,
            });
        }
        if (number) {
            queryBuilder.andWhere("project.number = :number", { number });
        }
        if (status) {
            queryBuilder.andWhere("LOWER(project.status) = LOWER(:status)", {
                status,
            });
        }
        if (fromDate) {
            queryBuilder.andWhere("project.createdAt >= :fromDate", { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere("project.createdAt <= :toDate", { toDate });
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async updateProject(id, data, translate) {
        const { document, templateId, number } = data;
        const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({ id: templateId });
        if (!projectTemplate) {
            throw new ApiError_1.default(translate("template-not-found"), 400);
        }
        const project = await Project_model_1.Project.findOneBy({ id });
        if (!project) {
            throw new ApiError_1.default(translate("project-not-found"), 404);
        }
        const isNumberExist = await Project_model_1.Project.getItemByNumber(number);
        if (isNumberExist && isNumberExist.id !== project.id) {
            throw new ApiError_1.default(translate("project-number-used"), 409);
        }
        Object.assign(project, {
            ...data,
            projectDocUrl: document || project.projectDocUrl,
            template: projectTemplate,
        });
        await project.save();
        return project;
    }
    static async deleteProject(id, translate) {
        const project = await Project_model_1.Project.findOneBy({ id });
        if (!project) {
            throw new ApiError_1.default(translate("project-not-found"), 404);
        }
        await project.softRemove();
        return project;
    }
    static async getProjectById(id) {
        return await Project_model_1.Project.findOne({
            where: { id },
            relations: {
                units: true,
                facilities: true,
                template: true,
            },
        });
    }
    static async getProjectWithProjectData(id) {
        const project = await Project_model_1.Project.findOne({
            where: { id, status: enums_1.CommonStatus.posted },
            relations: {
                // units: {
                //   floors: true,
                //   category: true,
                // },
                facilities: true,
                template: true,
            },
        });
        const projectUnitsData = await units_service_1.UnitService.getProjectUnitsGroupedByStatus(id);
        return { project, unitsData: projectUnitsData };
    }
}
exports.ProjectService = ProjectService;
