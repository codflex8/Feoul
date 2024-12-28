"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../../services/auth.service");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
class AuthController {
    static async addAdmin(req, res, next) {
        try {
            await auth_service_1.AuthService.createAdmin();
            res.status(201).json({ message: "sign_up_success" });
        }
        catch (error) {
            next(error);
        }
    }
    static async signIn(req, res, next) {
        try {
            const { user, token } = await auth_service_1.AuthService.signIn(req.body, req.t);
            res.status(200).json({ user, token });
        }
        catch (error) {
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
    static async refreshToken(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.refreshUserToken(req.body.refreshToken);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async protect(req, res, next) {
        try {
            if (!req.headers.authorization?.startsWith("Bearer")) {
                throw new ApiError_1.default(req.t("unauthorized"), 401);
            }
            const token = req.headers.authorization.split(" ")[1];
            req.user = await auth_service_1.AuthService.verifyAuthToken(token, req.t);
            next();
        }
        catch (error) {
            next(error);
        }
    }
    static allowedto(roles) {
        return (req, res, next) => {
            try {
                auth_service_1.AuthService.checkUserRole(req.user.role, roles, req.t);
                next();
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
