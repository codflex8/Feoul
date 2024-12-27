"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmpolyeeValidator = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.addEmpolyeeValidator = zod_1.z.object({
    username: zod_1.z.string().trim().min(3),
    password: zod_1.z.string().min(6),
    imageUrl: zod_1.z.string().optional().nullable(),
    role: zod_1.z.nativeEnum(enums_1.UsersRoles).default(enums_1.UsersRoles.Employee),
});
