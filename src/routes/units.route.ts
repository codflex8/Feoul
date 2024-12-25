import { Router } from "express";
import { UnitController } from "../controllers/units.controller";
import { validateData } from "../middleware/validationMiddleware";
import UnitValidator from "../utils/validators/UnitValidator";
import { upload } from "../middleware/uploadFiles";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";

const router = Router();

// Get all units
router.get("/", UnitController.getUnits);

// Get a single unit by ID
router.get("/:id", UnitController.getUnitById);

// Create a new unit
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(UnitValidator),
  UnitController.createUnit
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(UnitValidator),
  UnitController.updateUnit
);

// Delete a unit
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  UnitController.deleteUnit
);

export default router;
