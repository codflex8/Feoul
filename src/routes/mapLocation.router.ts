import { Router } from "express";
import { MapLocationController } from "../controllers/MapLocations.controller";
import { validateData } from "../middleware/validationMiddleware";
import { MapLocationValidator } from "../utils/validators/MapLocation";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", expressAsyncHandler(MapLocationController.getMapLocations));
router.get(
  "/:id",
  expressAsyncHandler(MapLocationController.getMapLocationById)
);
router.post(
  "/",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(MapLocationValidator),
  expressAsyncHandler(MapLocationController.createMapLocation)
);
router.put(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  validateData(MapLocationValidator),
  expressAsyncHandler(MapLocationController.updateMapLocation)
);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.allowedto([UsersRoles.Admin]),
  expressAsyncHandler(MapLocationController.deleteMapLocation)
);

export default router;
