import { Router } from "express";
import { PublicFacilitiesController } from "../../controllers/public/projectFacilities.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get(
  "/",
  expressAsyncHandler(PublicFacilitiesController.getProjectFacilitiess)
);

router.get(
  "/:id",
  expressAsyncHandler(PublicFacilitiesController.getProjectFacilitiesById)
);

export default router;
