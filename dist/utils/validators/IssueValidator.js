"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueValidator = void 0;
const zod_1 = require("zod");
exports.issueValidator = zod_1.z.object({
    name: zod_1.z.string().min(3).max(255),
    phoneNumber: zod_1.z.string(),
    description: zod_1.z.string(),
});
