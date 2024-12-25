import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import { upload } from "../middleware/uploadFiles";
import { ProjectFacilitiesController } from "../controllers/projectFacilities.controller";
import { projectFacilitesValidator } from "../utils/validators/ProjectValidator";

const router = Router();

router.get("/", ProjectFacilitiesController.getProjectFacilitiess);
router.get("/:id", ProjectFacilitiesController.getProjectFacilitiesById);
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(projectFacilitesValidator),
  ProjectFacilitiesController.createProjectFacilities
);
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(projectFacilitesValidator),
  ProjectFacilitiesController.updateProjectFacilities
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  ProjectFacilitiesController.deleteProjectFacilities
);

export default router;
