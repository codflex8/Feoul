"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitIntresetValidation = exports.unitFloorValidation = exports.unitCategoryValidation = exports.UnitStatus = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["saled"] = "saled";
    UnitStatus["reserved"] = "reserved";
    UnitStatus["avaliable"] = "avaliable";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
const UnitValidator = zod_1.z.object({
    name: zod_1.z.string(),
    projectId: zod_1.z.string(),
    number: zod_1.z.string().transform((val) => Number(val)),
    color: zod_1.z.string(),
    price: zod_1.z.string().transform((val) => Number(val)),
    landSpace: zod_1.z.string().transform((val) => Number(val)),
    buildSpace: zod_1.z.string().transform((val) => Number(val)),
    status: zod_1.z.nativeEnum(UnitStatus).default(UnitStatus.avaliable),
    bedroomNumber: zod_1.z.string().transform((val) => Number(val)),
    bathroomNumber: zod_1.z.string().transform((val) => Number(val)),
    videoUrl: zod_1.z.string().optional(),
    floorsNumber: zod_1.z.string().transform((val) => Number(val)),
    advantages: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
});
exports.unitCategoryValidation = zod_1.z.object({
    name: zod_1.z.string(),
    color: zod_1.z.string(),
    number: zod_1.z.string().transform((val) => Number(val)),
    status: zod_1.z.nativeEnum(enums_1.CommonStatus).default(enums_1.CommonStatus.archived),
    // unitId: z.string(),
});
exports.unitFloorValidation = zod_1.z.object({
    name: zod_1.z.string(),
    index: zod_1.z.string().transform((val) => Number(val)),
    unitId: zod_1.z.string(),
    image: zod_1.z.string(),
});
exports.unitIntresetValidation = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    area: zod_1.z.string(),
    email: zod_1.z.string().optional(),
    // status: z.string(),
    unitId: zod_1.z.string(),
});
exports.default = UnitValidator;
