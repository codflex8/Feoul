import { Router } from "express";
import projectRouter from "./project.router";
import unitRouter from "./units.router";
import facilitiesRouter from "./projectFacilities.router";
import unitCategoriesRouter from "./unitCategories.router";
import locationsRouter from "./mapLocations.router";
import unitIntresetRouter from "./unitIntreset.router";
import issueRouter from "./issue.router";

const router = Router();

router.use("/projects/", projectRouter);
router.use("/units/", unitRouter);
router.use("/map-locations/", locationsRouter);
router.use("/project-facilities/", facilitiesRouter);
router.use("/unit-category", unitCategoriesRouter);
router.use("/unit-intreset", unitIntresetRouter);
router.use("/issues", issueRouter);

export default router;
