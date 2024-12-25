import { Router } from "express";
import { MapLocationController } from "../controllers/MapLocations.controller";
import { validateData } from "../middleware/validationMiddleware";
import { MapLocationValidator } from "../utils/validators/MapLocation";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";

const router = Router();

router.get("/", MapLocationController.getMapLocations);
router.get("/:id", MapLocationController.getMapLocationById);
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(MapLocationValidator),
  MapLocationController.createMapLocation
);
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(MapLocationValidator),
  MapLocationController.updateMapLocation
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  MapLocationController.deleteMapLocation
);

export default router;
