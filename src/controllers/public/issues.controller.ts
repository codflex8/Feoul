import { Request, Response } from "express";
import { IssuesService } from "../../services/Issues.service";
import { Issue } from "../../utils/validators/IssueValidator";
export class PublicIssuesController {
  static async createIssue(req: Request<{}, {}, Issue>, res: Response) {
    const issue = await IssuesService.createIssue(req.body);
    res.status(201).json(issue);
  }
}
