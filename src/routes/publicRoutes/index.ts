import { Router } from "express";
import projectRouter from "./project.router";
import unitRouter from "./units.router";
import facilitiesRouter from "./projectFacilities.router";
import unitCategoriesRouter from "./unitCategories.router";

const router = Router();

router.use("/projects/", projectRouter);
router.use("/units/", unitRouter);
router.use("/project-facilities/", facilitiesRouter);
router.use("/unit-category", unitCategoriesRouter);

export default router;
