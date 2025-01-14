"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapLocations_controller_1 = require("../../controllers/public/mapLocations.controller");
const router = (0, express_1.Router)();
router.get("/", mapLocations_controller_1.PublicMapLocations.getMapLocations);
exports.default = router;
