"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
const ProjectTemplateValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    number: zod_1.z.number(),
    // projectId: z.string(),
    link: zod_1.z.string().url().optional(),
    status: zod_1.z.nativeEnum(enums_1.CommonStatus).default(enums_1.CommonStatus.archived),
});
exports.default = ProjectTemplateValidator;
