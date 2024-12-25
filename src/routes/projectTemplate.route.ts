import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import { upload } from "../middleware/uploadFiles";
import { ProjectTemplateController } from "../controllers/projectTemplate.controller";
import ProjectTemplateValidator from "../utils/validators/ProjectTemplateValidator";

const router = Router();

router.get("/", ProjectTemplateController.getProjectTemplates);
router.get("/:id", ProjectTemplateController.getProjectTemplateById);
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(ProjectTemplateValidator),
  ProjectTemplateController.createProjectTemplate
);
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(ProjectTemplateValidator),
  ProjectTemplateController.updateProjectTemplate
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  ProjectTemplateController.deleteProjectTemplate
);

export default router;
