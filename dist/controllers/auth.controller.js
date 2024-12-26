"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_model_1 = require("../entities/User.model");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createToken_1 = require("../utils/createToken");
const getUserFromToken_1 = require("../utils/getUserFromToken");
const enums_1 = require("../utils/types/enums");
class AuthController {
    constructor() {
        this.refreshToken = (req, res, next) => {
            const refreshToken = req.body.refreshToken;
            // if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            //   return res.status(403).json({ message: 'Refresh token not found' });
            // }
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_Refresh_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid refresh token" });
                }
                const currentUser = await User_model_1.User.findOne({
                    where: {
                        id: decoded?.userId,
                    },
                });
                if (!currentUser)
                    return res.status(401).json({ message: "Invalid refresh token" });
                const newAccessToken = (0, createToken_1.createToken)(decoded.userId);
                res.json({ token: newAccessToken });
            });
        };
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
    static async addAdmin(req, res, next) {
        const isThereAdmin = await User_model_1.User.findOneBy({ role: enums_1.UsersRoles.Admin });
        if (isThereAdmin) {
            return next(new ApiError_1.default("adminAlreadyExist", 409));
        }
        const cryptedPassword = await (0, bcryptPassword_1.default)("admin***");
        const user = await User_model_1.User.create({
            username: "admin",
            password: cryptedPassword,
            role: enums_1.UsersRoles.Admin,
        });
        await user.save();
        res.status(201).json({ message: "sign_up_success" });
    }
    static async signIn(req, res, next) {
        const user = await User_model_1.User.findOneBy({ username: (0, typeorm_1.Equal)(req.body.username) });
        if (!user ||
            !(await bcryptjs_1.default.compare(req.body.password, user.password))) {
            return next(new ApiError_1.default(req.t("IncorrectUsernamePasswod"), 401));
        }
        const token = (0, createToken_1.createToken)(user.id);
        const refreshToken = (0, createToken_1.createRefreshToken)(user.id);
        res.status(200).json({ user, token });
    }
    static async signOut(req, res, next) {
        const user = req.user;
        // user.fcm = null;
        await user.save();
        res.status(200).json({ message: "logout success" });
    }
    static async protect(req, res, next) {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new ApiError_1.default(req.t("unauthorized"), 401));
        }
        // 2) Verify token (no change happens, expired token)
        try {
            const { currentUser, decoded } = await (0, getUserFromToken_1.getUserFromToken)(token);
            if (!currentUser) {
                return next(new ApiError_1.default(req.t("unauthorized"), 401));
            }
            req.user = currentUser;
            next();
        }
        catch (error) {
            return next(error);
        }
    }
    static allowedto(roles) {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new ApiError_1.default(req.t("forbidden"), 403));
            }
            next();
        };
    }
}
exports.AuthController = AuthController;
