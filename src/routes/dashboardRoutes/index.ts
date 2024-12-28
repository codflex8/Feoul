import { Express, Router } from "express";
import authRouter from "./auth.route";
import empolyeeRouter from "./employee.route";
import projectRouter from "./project.route";
import unitsRouter from "./units.route";
import unitsCategoryRouter from "./unitCategory.route";
import projectTemplateRouter from "./projectTemplate.route";
import projectFacilitiesRouter from "./projectFacilities.route";
import unitFloorRouter from "./unitFloor.route";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";
import unitIntresetRouter from "./unitIntreset.router";
import mapLocationsRouter from "./mapLocation.router";
import { HomeController } from "../../controllers/dashboard/home.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/home", expressAsyncHandler(HomeController.index));
router.use(
  "/employee",

  AuthController.allowedto([UsersRoles.Admin]),
  empolyeeRouter
);
router.use("/projects", projectRouter);
router.use("/project-templates", projectTemplateRouter);
router.use("/project-facilities", projectFacilitiesRouter);
router.use("/units", unitsRouter);
router.use("/unit-category", unitsCategoryRouter);
router.use("/unit-floor", unitFloorRouter);
router.use("/unit-intreset", unitIntresetRouter);
router.use("/map-locations", mapLocationsRouter);

export default router;
