import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";
import { upload } from "../../middleware/uploadFiles";
import { ProjectTemplateController } from "../../controllers/dashboard/projectTemplate.controller";
import ProjectTemplateValidator from "../../utils/validators/ProjectTemplateValidator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get(
  "/",
  expressAsyncHandler(ProjectTemplateController.getProjectTemplates)
);
router.get(
  "/:id",
  expressAsyncHandler(ProjectTemplateController.getProjectTemplateById)
);
router.post(
  "/",

  AuthController.allowedto([UsersRoles.Admin]),
  validateData(ProjectTemplateValidator),
  expressAsyncHandler(ProjectTemplateController.createProjectTemplate)
);
router.put(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  validateData(ProjectTemplateValidator),
  expressAsyncHandler(ProjectTemplateController.updateProjectTemplate)
);
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(ProjectTemplateController.deleteProjectTemplate)
);

export default router;
