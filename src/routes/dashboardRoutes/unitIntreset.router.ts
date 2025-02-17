import { Router } from "express";
import { UsersRoles } from "../../utils/types/enums";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { validateData } from "../../middleware/validationMiddleware";
import {
  SetUnitIntresetStatusValidator,
  unitIntresetValidation,
} from "../../utils/validators/UnitValidator";
import { UnitIntresetController } from "../../controllers/dashboard/unitIntreset.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// Get all units
router.get(
  "/",

  expressAsyncHandler(UnitIntresetController.getUnitIntreset)
);

// Get a single unit by ID
router.get(
  "/:id",

  expressAsyncHandler(UnitIntresetController.getUnitIntresetById)
);

// Create a new unit
router.post(
  "/",
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(unitIntresetValidation),
  expressAsyncHandler(UnitIntresetController.createUnitIntreset)
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(unitIntresetValidation),
  expressAsyncHandler(UnitIntresetController.updateUnitIntreset)
);

router.post(
  "/:id/status",
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(SetUnitIntresetStatusValidator),
  expressAsyncHandler(UnitIntresetController.setUnitInterestStatus)
);

// Delete a unit
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(UnitIntresetController.deleteUnitIntreset)
);

export default router;
