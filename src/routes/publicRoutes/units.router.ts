import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { PublicUnitController } from "../../controllers/public/units.controller";

const router = Router();

router.get("/", expressAsyncHandler(PublicUnitController.getUnits));
router.get("/:id", expressAsyncHandler(PublicUnitController.getUnitById));

export default router;
