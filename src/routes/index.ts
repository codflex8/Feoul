import { Express } from "express";
import authRouter from "./auth.route";
import empolyeeRouter from "./employee.route";
import projectRouter from "./project.route";
import unitsRouter from "./units.route";
import unitsCategoryRouter from "./unitCategory.route";
import projectTemplateRouter from "./projectTemplate.route";
import projectFacilitiesRouter from "./projectFacilities.route";
import unitFloorRouter from "./unitFloor.route";
import { AuthController } from "../controllers/auth.controller";
import { UsersRoles } from "../utils/types/enums";
import unitIntresetRouter from "./unitIntreset.router";
import mapLocationsRouter from "./mapLocation.router";

export const setRoutes = (app: Express) => {
  app.use("/api/v1/auth", authRouter);
  app.use(
    "/api/v1/employee",
    AuthController.protect,
    AuthController.allowedto([UsersRoles.Admin]),
    empolyeeRouter
  );
  app.use("/api/v1/projects", projectRouter);
  app.use("/api/v1/project-templates", projectTemplateRouter);
  app.use("/api/v1/project-facilities", projectFacilitiesRouter);
  app.use("/api/v1/units", unitsRouter);
  app.use("/api/v1/unit-category", unitsCategoryRouter);
  app.use("/api/v1/unit-floor", unitFloorRouter);
  app.use("/api/v1/unit-intreset", unitIntresetRouter);
  app.use("/api/v1/map-locations", mapLocationsRouter);
};
