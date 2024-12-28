import { Router } from "express";
import { ProjectController } from "../../controllers/dashboard/project.controller";
import { validateData } from "../../middleware/validationMiddleware";
import { ProjectValidator } from "../../utils/validators/ProjectValidator";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";
import { upload } from "../../middleware/uploadFiles";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", expressAsyncHandler(ProjectController.getProjects));
router.get("/:id", expressAsyncHandler(ProjectController.getProjectById));
router.post(
  "/",

  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("document"),
  validateData(ProjectValidator),
  expressAsyncHandler(ProjectController.createProject)
);
router.put(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("document"),
  validateData(ProjectValidator),
  expressAsyncHandler(ProjectController.updateProject)
);
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(ProjectController.deleteProject)
);

export default router;
