import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/auth.service";
import ApiError from "../../utils/ApiError";

export class AuthController {
  public static async addAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AuthService.createAdmin();
      res.status(201).json({ message: "sign_up_success" });
    } catch (error) {
      next(error);
    }
  }

  public static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.signIn(req.body, req.t);
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  // public static async signOut(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     await AuthService.signOut(req.user);
  //     res.status(200).json({ message: "logout success" });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  public static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await AuthService.refreshUserToken(req.body.refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async protect(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization?.startsWith("Bearer")) {
        throw new ApiError(req.t("unauthorized"), 401);
      }
      const token = req.headers.authorization.split(" ")[1];
      req.user = await AuthService.verifyAuthToken(token, req.t);
      next();
    } catch (error) {
      next(error);
    }
  }

  public static allowedto(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        AuthService.checkUserRole(req.user.role, roles, req.t);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
