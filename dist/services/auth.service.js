"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_model_1 = require("../entities/User.model");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createToken_1 = require("../utils/createToken");
const getUserFromToken_1 = require("../utils/getUserFromToken");
const enums_1 = require("../utils/types/enums");
class AuthService {
    static async createAdmin() {
        const isThereAdmin = await User_model_1.User.findOneBy({ role: enums_1.UsersRoles.Admin });
        if (isThereAdmin) {
            throw new ApiError_1.default("adminAlreadyExist", 409);
        }
        const cryptedPassword = await (0, bcryptPassword_1.default)("admin***");
        const user = User_model_1.User.create({
            username: "admin",
            password: cryptedPassword,
            role: enums_1.UsersRoles.Admin,
        });
        await user.save();
        return user;
    }
    static async signIn(data, translate) {
        const user = await User_model_1.User.findOneBy({ username: (0, typeorm_1.Equal)(data.username) });
        if (!user ||
            !(await bcryptjs_1.default.compare(data.password, user.password))) {
            throw new ApiError_1.default(translate("IncorrectUsernamePasswod"), 401);
        }
        const token = (0, createToken_1.createToken)(user.id);
        const refreshToken = (0, createToken_1.createRefreshToken)(user.id);
        return { user, token, refreshToken };
    }
    //   static async signOut(user: User) {
    //     await user.save();
    //     return true;
    //   }
    static async refreshUserToken(refreshToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_Refresh_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    reject(new ApiError_1.default("Invalid refresh token", 403));
                }
                const currentUser = await User_model_1.User.findOne({
                    where: { id: decoded?.userId },
                });
                if (!currentUser) {
                    reject(new ApiError_1.default("Invalid refresh token", 401));
                }
                const newAccessToken = (0, createToken_1.createToken)(decoded.userId);
                resolve({ token: newAccessToken });
            });
        });
    }
    static async verifyAuthToken(token, translate) {
        const { currentUser, decoded } = await (0, getUserFromToken_1.getUserFromToken)(token);
        if (!currentUser) {
            throw new ApiError_1.default(translate("unauthorized"), 401);
        }
        return currentUser;
    }
    static checkUserRole(userRole, allowedRoles, translate) {
        if (!allowedRoles.includes(userRole)) {
            throw new ApiError_1.default(translate("forbidden"), 403);
        }
        return true;
    }
}
exports.AuthService = AuthService;
