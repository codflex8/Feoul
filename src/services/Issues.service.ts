import { Issues } from "../entities/Issues.model";
import { getPaginationData } from "../utils/getPaginationData";
import { BaseQuery } from "../utils/types/types";
import { Issue } from "../utils/validators/IssueValidator";

export class IssuesService {
  static async createIssue(data: Issue) {
    // Create a new issue
    const issue = new Issues();
    issue.name = data.name;
    issue.phoneNumber = data.phoneNumber;
    issue.description = data.description;
    // Save it to the database
    await issue.save();
    // Return the issue
    return data;
  }

  static async getIssues(query: BaseQuery & Issue) {
    // Find all issues
    const { skip, take } = getPaginationData({
      page: query.page,
      pageSize: query.pageSize,
    });
    const issuesQuery = await Issues.createQueryBuilder("issues");
    if (query.name) {
      issuesQuery.andWhere("LOWER(issues.name) Like LOWER(:name)", {
        name: `%${query.name}%`,
      });
    }
    if (query.phoneNumber) {
      issuesQuery.andWhere("issues.phoneNumber = :phoneNumber", {
        phoneNumber: `${query.phoneNumber}`,
      });
    }
    if (query.description) {
      issuesQuery.andWhere(
        "LOWER(issues.description) Like LOWER(:description)",
        {
          description: `%${query.description}%`,
        }
      );
    }
    return await issuesQuery.skip(skip).take(take).getManyAndCount();
    // Return the issues
  }
}
