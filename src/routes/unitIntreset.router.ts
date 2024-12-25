import { Router } from "express";
import { UsersRoles } from "../utils/types/enums";
import { AuthController } from "../controllers/auth.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import { unitIntresetValidation } from "../utils/validators/UnitValidator";
import { UnitIntresetController } from "../controllers/unitIntreset.controller";

const router = Router();

// Get all units
router.get("/", AuthController.protect, UnitIntresetController.getUnitIntreset);

// Get a single unit by ID
router.get(
  "/:id",
  AuthController.protect,
  UnitIntresetController.getUnitIntresetById
);

// Create a new unit
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitIntresetValidation),
  UnitIntresetController.createUnitIntreset
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitIntresetValidation),
  UnitIntresetController.updateUnitIntreset
);

// Delete a unit
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  UnitIntresetController.deleteUnitIntreset
);

export default router;
