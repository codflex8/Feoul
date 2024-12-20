import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User.model";
import { Equal } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateRandomCode from "../utils/generateCode";
import bcryptPassword from "../utils/bcryptPassword";
import ApiError from "../utils/ApiError";
import { createRefreshToken, createToken } from "../utils/createToken";
import sendEmail from "../utils/sendEmail";
import { getUserFromToken } from "../utils/getUserFromToken";
import { createSocialMediaUser } from "../utils/createSocialMediaUser";
import {
  getFacebookUserData,
  getTwitterUserData,
  verifyGoogleAuth,
} from "../utils/socialMediaAuth";

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, image } = req.body;
    const isUserExist = await User.findOne({
      where: {
        email: Equal(req.body.email),
      },
    });
    if (isUserExist) {
      return next(new ApiError(req.t("this_email_signed_up_already"), 409));
    }
    // 1- Create user
    const cryptedPassword = await bcryptPassword(password);
    const user = await User.create({
      username,
      email,
      password: cryptedPassword,
      imageUrl: image,
    });
    const resetCode = generateRandomCode();
    user.verifyCode = resetCode;

    await user.save();
    delete user.password;
    delete user.passwordChangedAt;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    delete user.verifyCode;
    // 2- Generate token
    const token = createToken(user.id);

    // 3- send verify email
    const message = `Hi ${user.username},\n Thanks for signing up with Ilearn.this is verify code, this is verify code ${resetCode}`;
    try {
      await sendEmail(
        user.email,
        "Your verify code (valid for 10 min)",
        message
      );
    } catch (error) {
      user.verifyCode = undefined;
      await user.save();
      return next(new ApiError("There is an error in sending email", 400));
    }

    res.status(201).json({ message: req.t("sign_up_success") });
  }

  public static async resendVerifyCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(new ApiError(req.t("emailNotExist"), 404));
    }
    const resetCode = generateRandomCode();
    user.verifyCode = resetCode;
    await user.save();
    const message = `Hi ${user.username},\n Thanks for signing up with Ilearn.this is verify code, this is verify code ${resetCode}`;
    try {
      await sendEmail(user.email, "Your verify code", message);
    } catch (error) {
      user.verifyCode = undefined;
      await user.save();
      return next(new ApiError("There is an error in sending email", 400));
    }
    res.status(200).json({ message: "email sent success" });
  }

  public static async verifyUserEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(new ApiError(req.t("emailNotExist"), 404));
    }
    if (user.verifyCode != req.body.verifyCode) {
      return next(new ApiError(req.t("invalid_code"), 400));
    }
    user.verifyEmail = true;
    user.verifyCode = undefined;
    await user.save();
    res.status(200).json({ message: "email verified" });
  }

  public static async signIn(req: Request, res: Response, next: NextFunction) {
    const user = await User.findOneBy({ email: Equal(req.body.email) });

    if (
      !user ||
      !(await bcrypt.compare(req.body.password, user.password as string))
    ) {
      return next(new ApiError(req.t("IncorrectEmailPasswod"), 401));
    }
    if (!user.verifyEmail) {
      return next(new ApiError(req.t("emailNotVerified"), 401));
    }

    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    delete user.password;
    res.status(200).json({ user, token, refreshToken });
  }

  public static async signOut(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    // user.fcm = null;
    await user.save();
    res.status(200).json({ message: "logout success" });
  }

  public refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken;

    // if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json({ message: 'Refresh token not found' });
    // }

    jwt.verify(
      refreshToken,
      process.env.JWT_Refresh_SECRET_KEY!,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        const currentUser = await User.findOne({
          where: {
            id: decoded?.userId,
          },
        });
        if (!currentUser)
          return res.status(401).json({ message: "Invalid refresh token" });

        try {
          AuthController.verifyUserChangePassword(currentUser, decoded, req.t);
        } catch (error: any) {
          return next(error);
        }
        const newAccessToken = createToken((decoded as any).userId);
        res.json({ token: newAccessToken });
      }
    );
  };

  public static async protect(req: Request, res: Response, next: NextFunction) {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new ApiError(req.t("unauthorized"), 401));
    }

    // 2) Verify token (no change happens, expired token)
    const { currentUser, decoded } = await getUserFromToken(token);
    if (!currentUser) {
      return next(new ApiError(req.t("unauthorized"), 401));
    }
    try {
      this.verifyUserChangePassword(currentUser, decoded, req.t);
    } catch (error: any) {
      return next(error);
    }
    delete currentUser.password;
    delete currentUser.passwordChangedAt;
    delete currentUser.passwordResetCode;
    delete currentUser.passwordResetExpires;
    delete currentUser.passwordResetVerified;

    req.user = currentUser;
    next();
  }

  private static verifyUserChangePassword(
    currentUser: User,
    decoded: any,
    t: any
  ) {
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp =
        currentUser.passwordChangedAt.getTime() / 1000;
      // Password changed after token created (Error)
      if (decoded.iat && passChangedTimestamp > decoded.iat) {
        throw new ApiError(t("passwordChanged"), 401);
      }
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // 1) Get user by email
    const user = await User.findOne({
      where: { email: Equal(req.body.email) },
    });
    if (!user) {
      return next(
        new ApiError(req.t("emailNotExist", { email: req.body.email }), 404)
      );
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = generateRandomCode();

    // Save hashed password reset code into db
    user.passwordResetCode = resetCode;
    // Add expiration time for password reset code (10 min)
    const oneMinuteLater = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetExpires = oneMinuteLater;
    user.passwordResetVerified = false;

    await user.save();

    // 3) Send the reset code via email
    const message = `Hi ${user.username},\n We received a request to reset the password on your Ilearn Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
      await sendEmail(
        user.email,
        "Your password reset code (valid for 10 min)",
        message
      );
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      return next(new ApiError("There is an error in sending email", 400));
    }

    res
      .status(200)
      .json({ status: "Success", message: "Reset code sent to email" });
  }

  public static async verifyPassResetCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // 1) Get user based on reset code
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(new ApiError(req.t("expired_code_please_try_again"), 400));
    }
    const timeDiff = Date.now() - Number(user.passwordResetExpires);

    const oneMinutesInMilliesecond = 60000 * 10;
    if (
      timeDiff > oneMinutesInMilliesecond ||
      user.passwordResetCode != req.body.resetCode
    ) {
      return next(
        new ApiError(req.t("invalid_reset_code_please_login_again"), 400)
      );
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
      status: "Success",
    });
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // 1) Get user based on email
    const user = await User.findOne({
      where: { email: Equal(req.body.email) },
    });
    if (!user) {
      return next(new ApiError(req.t("emailNotExist"), 404));
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
      return next(new ApiError(req.t("inva"), 400));
    }
    const cryptedPassword = await bcryptPassword(req.body.password);
    user.password = cryptedPassword;
    user.passwordChangedAt = new Date();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;

    await user.save();

    // 3) if everything is ok, generate token
    const token = createToken(user.id);
    res.status(200).json({ token });
  }

  public static async googleAuthSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.body;
    const { email, username, imageUrl, userId } = await verifyGoogleAuth(token);
    const isUserExist = await User.findOne({
      where: [
        {
          googleId: userId,
        },
        {
          email,
        },
      ],
    });
    if (isUserExist) {
      if (email === isUserExist.email && !isUserExist.googleId) {
        return next(new ApiError(req.t("this_email_signed_up_already"), 409));
      }
      return next(new ApiError(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
      email,
      username,
      imageUrl,
      googleId: userId,
    });
    const authToken = createToken(newUser.id);
    res.status(201).json({
      message: req.t("google_signup_success"),
      user: newUser,
      token: authToken,
    });
  }

  public static async googleAuthSignIn(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.body;
    const userData = await verifyGoogleAuth(token);

    const user = await User.getPublicUserDataByEmail({
      googleId: userData.userId,
    });
    if (!user) {
      return next(new ApiError(req.t("user_email_not_exist"), 409));
    }

    const authToken = createToken(user.id);
    res.status(201).json({ user, token: authToken });
  }

  public static async facebookAuthSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.body;
    const { email, username, imageUrl, userId } = await getFacebookUserData(
      token
    );
    const isUserExist = await User.findOne({
      where: [
        {
          facebookId: userId,
        },
        {
          email,
        },
      ],
    });
    if (isUserExist) {
      if (email === isUserExist.email && !isUserExist.facebookId) {
        return next(new ApiError(req.t("this_email_signed_up_already"), 409));
      }
      return next(new ApiError(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
      email,
      username,
      imageUrl,
      facebookId: userId,
    });
    const authToken = createToken(newUser.id);
    res.status(201).json({
      message: req.t("facebook_signup_success"),
      user: newUser,
      token: authToken,
    });
  }

  public static async facebookAuthSignIn(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.body;
    const { userId } = await getFacebookUserData(token);

    const user = await User.getPublicUserDataByEmail({ facebookId: userId });
    if (!user) {
      return next(new ApiError(req.t("user_not_signed_up"), 400));
    }

    const authToken = createToken(user.id);
    res.status(201).json({ user, token: authToken });
  }

  public static async twitterAuthSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { authToken, authTokenSecret } = req.body;
    const { email, username, imageUrl, userId } = await getTwitterUserData(
      authToken,
      authTokenSecret
    );
    const isUserExist = await User.findOne({
      where: [
        {
          twitterId: userId,
        },
        {
          email,
        },
      ],
    });
    if (isUserExist) {
      if (email === isUserExist.email && !isUserExist.twitterId) {
        return next(new ApiError(req.t("this_email_signed_up_already"), 409));
      }
      return next(new ApiError(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
      email,
      username,
      imageUrl,
      twitterId: userId,
    });
    const token = createToken(newUser.id);
    res.status(201).json({
      message: req.t("twitter_signup_success"),
      user: newUser,
      token,
    });
  }

  public static async twitterAuthSignIn(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { authToken, authTokenSecret } = req.body;
    const userData = await getTwitterUserData(authToken, authTokenSecret);

    const user = await User.getPublicUserDataByEmail({
      twitterId: userData.userId,
    });
    if (!user) {
      return next(new ApiError(req.t("user_email_not_exist"), 409));
    }

    const token = createToken(user.id);
    res.status(201).json({ user, token });
  }
}
