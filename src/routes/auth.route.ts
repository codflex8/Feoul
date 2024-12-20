import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  forgetPasswordValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  socialMediaAuthValidator,
  twitterAuthValidator,
  verifyEmailValidator,
  verifyForgetPasswordValidator,
} from "../utils/validators/AuthValidator";
import { upload } from "../middleware/uploadFiles";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("image"),
  validateData(signUpValidator),
  AuthController.signup
);
authRouter.post(
  "/signin",
  validateData(signInValidator),
  AuthController.signIn
);
authRouter.post("/signout", AuthController.protect, AuthController.signOut);

// authRouter.post("/refreshToken", AuthController.refreshToken);
authRouter.post(
  "/forgotPassword",
  validateData(forgetPasswordValidator),
  AuthController.forgotPassword
);
authRouter.post(
  "/verifyResetCode",
  validateData(verifyForgetPasswordValidator),
  AuthController.verifyPassResetCode
);
authRouter.put(
  "/resetPassword",
  validateData(resetPasswordValidator),
  AuthController.resetPassword
);

authRouter.post(
  "/google/signup",
  validateData(socialMediaAuthValidator),
  AuthController.googleAuthSignUp
);
authRouter.post(
  "/google/signin",
  validateData(socialMediaAuthValidator),
  AuthController.googleAuthSignIn
);

authRouter.post(
  "/facebook/signup",
  validateData(socialMediaAuthValidator),
  AuthController.facebookAuthSignUp
);
authRouter.post(
  "/facebook/signin",
  validateData(socialMediaAuthValidator),
  AuthController.facebookAuthSignIn
);

authRouter.post(
  "/twitter/signup",
  validateData(twitterAuthValidator),
  AuthController.twitterAuthSignUp
);

authRouter.post(
  "/resend-verification-email",
  validateData(forgetPasswordValidator),
  AuthController.resendVerifyCode
);
authRouter.post(
  "/verify-email",
  validateData(verifyEmailValidator),
  AuthController.verifyUserEmail
);

authRouter.post(
  "/twitter/signin",
  validateData(twitterAuthValidator),
  AuthController.twitterAuthSignIn
);

export default authRouter;
