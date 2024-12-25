import { Router } from "express";
import { UnitFloorController } from "../controllers/unitFloor.controller";
import { UsersRoles } from "../utils/types/enums";
import { AuthController } from "../controllers/auth.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import { unitFloorValidation } from "../utils/validators/UnitValidator";

const router = Router();

// Get all units
router.get("/", UnitFloorController.getUnitFloor);

// Get a single unit by ID
router.get("/:id", UnitFloorController.getUnitFloorById);

// Create a new unit
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitFloorValidation),
  UnitFloorController.createUnitFloor
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitFloorValidation),
  UnitFloorController.updateUnitFloor
);

// Delete a unit
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  UnitFloorController.deleteUnitFloor
);

export default router;
