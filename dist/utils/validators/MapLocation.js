"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapLocationValidator = void 0;
const zod_1 = require("zod");
exports.MapLocationValidator = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
