import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { validateData } from "../middleware/validationMiddleware";
import { ProjectValidator } from "../utils/validators/ProjectValidator";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import { upload } from "../middleware/uploadFiles";

const router = Router();

router.get("/", ProjectController.getProjects);
router.get("/:id", ProjectController.getProjectById);
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("document"),
  validateData(ProjectValidator),
  ProjectController.createProject
);
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("document"),
  validateData(ProjectValidator),
  ProjectController.updateProject
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  ProjectController.deleteProject
);

export default router;
