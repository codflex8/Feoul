import { Router } from "express";
import { IssuesController } from "../../controllers/dashboard/issues.controller";

const router = Router();

router.get("/", IssuesController.getIssues);

export default router;
