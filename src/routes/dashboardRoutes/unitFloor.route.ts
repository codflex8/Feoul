import { Router } from "express";
import { UnitFloorController } from "../../controllers/dashboard/unitFloor.controller";
import { UsersRoles } from "../../utils/types/enums";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { upload } from "../../middleware/uploadFiles";
import { validateData } from "../../middleware/validationMiddleware";
import {
  unitCategoryFloorUpdate,
  unitFloorValidation,
} from "../../utils/validators/UnitValidator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// Get all units
router.get("/", expressAsyncHandler(UnitFloorController.getUnitFloor));

// Get a single unit by ID
router.get("/:id", expressAsyncHandler(UnitFloorController.getUnitFloorById));

// Create a new unit
router.post(
  "/",

  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitFloorValidation),
  expressAsyncHandler(UnitFloorController.createUnitFloor)
);

router.put(
  "/categories-floors",
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitCategoryFloorUpdate),
  expressAsyncHandler(UnitFloorController.updateUnitCategoryFloors)
);

router.post(
  "/categories-floors",
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitCategoryFloorUpdate),
  expressAsyncHandler(UnitFloorController.addUnitCategoryFloors)
);

// Update an existing unit
router.put(
  "/:id",
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("image"),
  validateData(unitFloorValidation),
  expressAsyncHandler(UnitFloorController.updateUnitFloor)
);

// Delete a unit
router.delete(
  "/:id",

  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(UnitFloorController.deleteUnitFloor)
);

export default router;
