import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import { signInValidator } from "../utils/validators/AuthValidator";
import expressAsyncHandler from "express-async-handler";
const authRouter = Router();

authRouter.post(
  "/signin",
  validateData(signInValidator),
  expressAsyncHandler(AuthController.signIn)
);

authRouter.post("/admin", expressAsyncHandler(AuthController.addAdmin));
authRouter.post(
  "/signout",
  AuthController.protect,
  expressAsyncHandler(AuthController.signOut)
);

// authRouter.post("/refreshToken", AuthController.refreshToken);

export default authRouter;
