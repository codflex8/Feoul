import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware";
import { unitCategoryValidation } from "../../utils/validators/UnitValidator";
import { upload } from "../../middleware/uploadFiles";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";
import { UnitCategoryController } from "../../controllers/dashboard/unitCategory.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// Get all units
router.get("/", expressAsyncHandler(UnitCategoryController.getUnitCategories));

// Get a single unit by ID
router.get(
  "/:id",
  expressAsyncHandler(UnitCategoryController.getUnitCategoryById)
);

// Create a new unit
router.post(
  "/",

  AuthController.allowedto([UsersRoles.Admin]),
  validateData(unitCategoryValidation),
  expressAsyncHandler(UnitCategoryController.createUnitCategory)
);

// Update an existing unit
router.put(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  validateData(unitCategoryValidation),
  expressAsyncHandler(UnitCategoryController.updateUnitCategory)
);

// Delete a unit
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(UnitCategoryController.deleteUnitCategory)
);

export default router;
