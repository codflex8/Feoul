import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { unitCategoryValidation } from "../utils/validators/UnitValidator";
import { upload } from "../middleware/uploadFiles";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import { UnitCategoryController } from "../controllers/unitCategory.controller";

const router = Router();

// Get all units
router.get("/", UnitCategoryController.getUnitCategories);

// Get a single unit by ID
router.get("/:id", UnitCategoryController.getUnitCategoryById);

// Create a new unit
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(unitCategoryValidation),
  UnitCategoryController.createUnitCategory
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("video"),
  validateData(unitCategoryValidation),
  UnitCategoryController.updateUnitCategory
);

// Delete a unit
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  UnitCategoryController.deleteUnitCategory
);

export default router;
