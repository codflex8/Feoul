"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTemplateService = void 0;
const ProjectTemplate_model_1 = require("../entities/ProjectTemplate.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const getPaginationData_1 = require("../utils/getPaginationData");
class ProjectTemplateService {
    static async createProjectTemplate(data, translate) {
        const { number } = data;
        const isTemplateExist = await ProjectTemplate_model_1.ProjectTemplate.getItemByNumber(number);
        if (isTemplateExist) {
            throw new ApiError_1.default(translate("template-number-used"), 409);
        }
        const projectTemplate = ProjectTemplate_model_1.ProjectTemplate.create({ ...data });
        await projectTemplate.save();
        return projectTemplate;
    }
    static async getProjectTemplates(query) {
        const { page, pageSize, name, number, status } = query;
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
        const queryBuilder = ProjectTemplate_model_1.ProjectTemplate.createQueryBuilder("projectTemplate");
        if (name) {
            queryBuilder.andWhere("LOWER(projectTemplate.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }
        if (number) {
            queryBuilder.andWhere("projectTemplate.number = :number", { number });
        }
        if (status) {
            queryBuilder.andWhere("LOWER(projectTemplate.status) = LOWER(:status)", {
                status,
            });
        }
        return await queryBuilder.skip(skip).take(take).getManyAndCount();
    }
    static async getProjectTemplateById(id) {
        return await ProjectTemplate_model_1.ProjectTemplate.findOneBy({ id });
    }
    static async updateProjectTemplate(id, data, translate) {
        const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({ id });
        if (!projectTemplate) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        const isTemplateExist = await ProjectTemplate_model_1.ProjectTemplate.getItemByNumber(data.number);
        if (isTemplateExist && isTemplateExist.id !== projectTemplate.id) {
            throw new ApiError_1.default(translate("template-number-used"), 409);
        }
        Object.assign(projectTemplate, data);
        await projectTemplate.save();
        return projectTemplate;
    }
    static async deleteProjectTemplate(id, translate) {
        const projectTemplate = await ProjectTemplate_model_1.ProjectTemplate.findOneBy({ id });
        if (!projectTemplate) {
            throw new ApiError_1.default(translate("not-found"), 404);
        }
        await projectTemplate.softRemove();
        return projectTemplate;
    }
}
exports.ProjectTemplateService = ProjectTemplateService;
