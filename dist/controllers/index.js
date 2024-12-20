"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = void 0;
class IndexController {
    async getUser(req, res, next) {
        // Logic to get a user
        return res.json({ message: "Get user" });
    }
    async createUser(req, res, next) {
        // Logic to create a user
        return res.json({ message: "User created" });
    }
}
exports.IndexController = IndexController;
