import { Router } from "express";
import { UsersRoles } from "../../utils/types/enums";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { validateData } from "../../middleware/validationMiddleware";
import { unitIntresetValidation } from "../../utils/validators/UnitValidator";
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
  validateData(unitIntresetValidation),
  expressAsyncHandler(UnitIntresetController.createUnitIntreset)
);

// Update an existing unit
router.put(
  "/:id",
  validateData(unitIntresetValidation),
  expressAsyncHandler(UnitIntresetController.updateUnitIntreset)
);

// Delete a unit
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(UnitIntresetController.deleteUnitIntreset)
);

export default router;
