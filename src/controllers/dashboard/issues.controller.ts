import { Request, Response } from "express";
import { BaseQuery } from "../../utils/types/types";
import { Issue } from "../../utils/validators/IssueValidator";
import { IssuesService } from "../../services/Issues.service";
import { GenericResponse } from "../../utils/GenericResponse";
export class IssuesController {
  static async getIssues(
    req: Request<{}, {}, {}, BaseQuery & Issue>,
    res: Response
  ) {
    const [issues, count] = await IssuesService.getIssues(req.query);
    res
      .status(200)
      .json(
        new GenericResponse(req.query.page, req.query.pageSize, count, issues)
      );
  }
}
