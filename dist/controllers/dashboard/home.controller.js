"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const home_service_1 = require("../../services/home.service");
class HomeController {
    static async index(req, res, next) {
        try {
            const dashboardData = await home_service_1.HomeService.getDashboardData(req.query);
            res.status(200).json(dashboardData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HomeController = HomeController;
