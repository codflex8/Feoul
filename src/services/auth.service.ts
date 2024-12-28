import { User } from "../entities/User.model";
import { Equal } from "typeorm";
import { TFunction } from "i18next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bcryptPassword from "../utils/bcryptPassword";
import ApiError from "../utils/ApiError";
import { createRefreshToken, createToken } from "../utils/createToken";
import { getUserFromToken } from "../utils/getUserFromToken";
import { UsersRoles } from "../utils/types/enums";

interface SignInData {
  username: string;
  password: string;
}

export class AuthService {
  static async createAdmin() {
    const isThereAdmin = await User.findOneBy({ role: UsersRoles.Admin });
    if (isThereAdmin) {
      throw new ApiError("adminAlreadyExist", 409);
    }

    const cryptedPassword = await bcryptPassword("admin***");
    const user = User.create({
      username: "admin",
      password: cryptedPassword,
      role: UsersRoles.Admin,
    });
    await user.save();
    return user;
  }

  static async signIn(data: SignInData, translate: TFunction) {
    const user = await User.findOneBy({ username: Equal(data.username) });

    if (
      !user ||
      !(await bcrypt.compare(data.password, user.password as string))
    ) {
      throw new ApiError(translate("IncorrectUsernamePasswod"), 401);
    }

    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    return { user, token, refreshToken };
  }

  //   static async signOut(user: User) {
  //     await user.save();
  //     return true;
  //   }

  static async refreshUserToken(refreshToken: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.JWT_Refresh_SECRET_KEY!,
        async (err: any, decoded: any) => {
          if (err) {
            reject(new ApiError("Invalid refresh token", 403));
          }
          const currentUser = await User.findOne({
            where: { id: decoded?.userId },
          });
          if (!currentUser) {
            reject(new ApiError("Invalid refresh token", 401));
          }
          const newAccessToken = createToken(decoded.userId);
          resolve({ token: newAccessToken });
        }
      );
    });
  }

  static async verifyAuthToken(token: string, translate: TFunction) {
    const { currentUser, decoded } = await getUserFromToken(token);
    if (!currentUser) {
      throw new ApiError(translate("unauthorized"), 401);
    }
    return currentUser;
  }

  static checkUserRole(
    userRole: string,
    allowedRoles: string[],
    translate: TFunction
  ) {
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(translate("forbidden"), 403);
    }
    return true;
  }
}
