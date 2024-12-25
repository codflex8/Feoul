import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User.model";
import { Equal } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bcryptPassword from "../utils/bcryptPassword";
import ApiError from "../utils/ApiError";
import { createRefreshToken, createToken } from "../utils/createToken";
import { getUserFromToken } from "../utils/getUserFromToken";
import { UsersRoles } from "../utils/types/enums";

export class AuthController {
  public static async addAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isThereAdmin = await User.findOneBy({ role: UsersRoles.Admin });
    if (isThereAdmin) {
      return next(new ApiError("adminAlreadyExist", 409));
    }
    const cryptedPassword = await bcryptPassword("admin***");
    const user = await User.create({
      username: "admin",
      password: cryptedPassword,
      role: UsersRoles.Admin,
    });
    await user.save();
    res.status(201).json({ message: "sign_up_success" });
  }

  public static async signIn(req: Request, res: Response, next: NextFunction) {
    const user = await User.findOneBy({ username: Equal(req.body.username) });

    if (
      !user ||
      !(await bcrypt.compare(req.body.password, user.password as string))
    ) {
      return next(new ApiError(req.t("IncorrectUsernamePasswod"), 401));
    }

    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    res.status(200).json({ user, token });
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
    try {
      const { currentUser, decoded } = await getUserFromToken(token);
      if (!currentUser) {
        return next(new ApiError(req.t("unauthorized"), 401));
      }
      req.user = currentUser;
      next();
    } catch (error) {
      return next(error);
    }
  }

  public static allowedto(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(new ApiError(req.t("forbidden"), 403));
      }
      next();
    };
  }

  // public static async resetPassword(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   // 1) Get user based on email
  //   const user = await User.findOne({
  //     where: { email: Equal(req.body.email) },
  //   });
  //   if (!user) {
  //     return next(new ApiError(req.t("emailNotExist"), 404));
  //   }

  //   // 2) Check if reset code verified
  //   if (!user.passwordResetVerified) {
  //     return next(new ApiError(req.t("inva"), 400));
  //   }
  //   const cryptedPassword = await bcryptPassword(req.body.password);
  //   user.password = cryptedPassword;
  //   user.passwordChangedAt = new Date();
  //   user.passwordResetCode = undefined;
  //   user.passwordResetExpires = undefined;
  //   user.passwordResetVerified = false;

  //   await user.save();

  //   // 3) if everything is ok, generate token
  //   const token = createToken(user.id);
  //   res.status(200).json({ token });
  // }
}
