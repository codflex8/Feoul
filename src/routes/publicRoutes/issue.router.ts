import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware";
import { issueValidator } from "../../utils/validators/IssueValidator";
import { PublicIssuesController } from "../../controllers/public/issues.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post(
  "/",
  validateData(issueValidator),
  expressAsyncHandler(PublicIssuesController.createIssue)
);

export default router;
