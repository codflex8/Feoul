import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import { upload } from "../middleware/uploadFiles";
import { ProjectFacilitiesController } from "../controllers/projectFacilities.controller";
import { projectFacilitesValidator } from "../utils/validators/ProjectValidator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get(
  "/",
  expressAsyncHandler(ProjectFacilitiesController.getProjectFacilitiess)
);
router.get(
  "/:id",
  expressAsyncHandler(ProjectFacilitiesController.getProjectFacilitiesById)
);
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
  expressAsyncHandler(ProjectFacilitiesController.updateProjectFacilities)
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(ProjectFacilitiesController.deleteProjectFacilities)
);

export default router;
