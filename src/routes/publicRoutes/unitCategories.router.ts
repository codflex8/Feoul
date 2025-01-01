import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { PublicUnitCategory } from "../../controllers/public/unitCategory.controller";

const router = Router();

router.get("/", expressAsyncHandler(PublicUnitCategory.getUnitCategories));

router.get("/:id", expressAsyncHandler(PublicUnitCategory.getUnitCategoryById));

export default router;
