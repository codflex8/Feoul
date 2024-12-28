"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectFacilitesValidator = exports.ProjectValidator = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
exports.ProjectValidator = zod_1.z.object({
    name: zod_1.z.string(),
    lat: zod_1.z.string().transform((val) => Number(val)),
    lng: zod_1.z.string().transform((val) => Number(val)),
    number: zod_1.z.string().transform((val) => Number(val)),
    status: zod_1.z.nativeEnum(enums_1.CommonStatus).default(enums_1.CommonStatus.archived),
    projectDocUrl: zod_1.z.string().url().optional(),
    city: zod_1.z.string().optional(),
    templateId: zod_1.z.string(),
});
exports.projectFacilitesValidator = zod_1.z.object({
    name: zod_1.z.string(),
    projectId: zod_1.z.string(),
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
