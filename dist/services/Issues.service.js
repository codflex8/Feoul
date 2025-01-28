"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const Issues_model_1 = require("../entities/Issues.model");
const getPaginationData_1 = require("../utils/getPaginationData");
class IssuesService {
    static async createIssue(data) {
        // Create a new issue
        const issue = new Issues_model_1.Issues();
        issue.name = data.name;
        issue.phoneNumber = data.phoneNumber;
        issue.description = data.description;
        // Save it to the database
        await issue.save();
        // Return the issue
        return data;
    }
    static async getIssues(query) {
        // Find all issues
        const { skip, take } = (0, getPaginationData_1.getPaginationData)({
            page: query.page,
            pageSize: query.pageSize,
        });
        const issuesQuery = await Issues_model_1.Issues.createQueryBuilder("issues");
        if (query.name) {
            issuesQuery.andWhere("LOWER(issues.name) = LOWER(:name)", {
                name: `%${query.name}%`,
            });
        }
        if (query.phoneNumber) {
            issuesQuery.andWhere("issues.phoneNumber = :phoneNumber", {
                phoneNumber: `%${query.phoneNumber}%`,
            });
        }
        if (query.description) {
            issuesQuery.andWhere("LOWER(issues.description) = LOWER(:description)", {
                description: `%${query.description}%`,
            });
        }
        return await issuesQuery.skip(skip).take(take).getManyAndCount();
        // Return the issues
    }
}
exports.IssuesService = IssuesService;
