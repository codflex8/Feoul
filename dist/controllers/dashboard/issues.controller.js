"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesController = void 0;
const Issues_service_1 = require("../../services/Issues.service");
const GenericResponse_1 = require("../../utils/GenericResponse");
class IssuesController {
    static async getIssues(req, res) {
        const [issues, count] = await Issues_service_1.IssuesService.getIssues(req.query);
        res
            .status(200)
            .json(new GenericResponse_1.GenericResponse(req.query.page, req.query.pageSize, count, issues));
    }
}
exports.IssuesController = IssuesController;
