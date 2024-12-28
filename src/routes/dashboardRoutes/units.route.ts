import { Router } from "express";
import { UnitController } from "../../controllers/dashboard/units.controller";
import { validateData } from "../../middleware/validationMiddleware";
import UnitValidator from "../../utils/validators/UnitValidator";
import { upload } from "../../middleware/uploadFiles";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// Get all units
router.get("/", expressAsyncHandler(UnitController.getUnits));

// Get a single unit by ID
router.get("/:id", expressAsyncHandler(UnitController.getUnitById));

// Create a new unit
router.post(
  "/",

  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(UnitValidator),
  expressAsyncHandler(UnitController.createUnit)
);

// Update an existing unit
router.put(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(UnitValidator),
  expressAsyncHandler(UnitController.updateUnit)
);

// Delete a unit
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(UnitController.deleteUnit)
);

export default router;
