import { Express } from "express";
import dashboardRouter from "./dashboardRoutes";
import { AuthController } from "../controllers/dashboard/auth.controller";
import authRouter from "./dashboardRoutes/auth.route";
export const setRoutes = (app: Express) => {
  app.use("/api/v1/dashboard/auth", authRouter);
  app.use("/api/v1/dashboard", AuthController.protect, dashboardRouter);
};
