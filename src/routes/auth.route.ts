import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import { signInValidator } from "../utils/validators/AuthValidator";

const authRouter = Router();

authRouter.post(
  "/signin",
  validateData(signInValidator),
  AuthController.signIn
);

authRouter.post("/admin", AuthController.addAdmin);
authRouter.post("/signout", AuthController.protect, AuthController.signOut);

// authRouter.post("/refreshToken", AuthController.refreshToken);

export default authRouter;
