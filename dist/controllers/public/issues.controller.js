"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIssuesController = void 0;
const Issues_service_1 = require("../../services/Issues.service");
class PublicIssuesController {
    static async createIssue(req, res) {
        const issue = await Issues_service_1.IssuesService.createIssue(req.body);
        res.status(201).json(issue);
    }
}
exports.PublicIssuesController = PublicIssuesController;
