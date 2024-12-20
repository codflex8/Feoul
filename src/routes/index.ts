import { Router, Express } from "express";
import authRouter from "./auth.route";

export const setRoutes = (app: Express) => {
  app.use("/api/v1/auth", authRouter);
};
