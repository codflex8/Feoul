"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseUnitValidator = exports.unitIntresetValidation = exports.unitCategoryFloorUpdate = exports.unitFloorValidation = exports.unitCategoryValidation = exports.SetUnitStatusValidator = exports.UnitBuildStatus = exports.UnitTemplates = exports.UnitIntresetStatus = exports.UnitTypes = exports.UnitStatus = exports.CategoriesImages = exports.UnitCategoriesNames = void 0;
const zod_1 = require("zod");
const enums_1 = require("../types/enums");
var UnitCategoriesNames;
(function (UnitCategoriesNames) {
    UnitCategoriesNames["yasmeen"] = "\u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646";
    UnitCategoriesNames["toleeb"] = "\u062A\u0648\u0644\u064A\u0628";
    UnitCategoriesNames["orkeed"] = "\u0627\u0648\u0631\u0643\u064A\u062F";
})(UnitCategoriesNames || (exports.UnitCategoriesNames = UnitCategoriesNames = {}));
exports.CategoriesImages = {
    yasmeen: [
        "/public/categories/yasmeen/yasmeen-1.jpeg",
        "/public/categories/yasmeen/yasmeen-2.jpeg",
        "/public/categories/yasmeen/yasmeen-3.jpeg",
        "/public/categories/yasmeen/yasmeen-4.jpeg",
    ],
    orkeed: [
        "/public/categories/orkeed/orkeed-1.jpeg",
        "/public/categories/orkeed/orkeed-2.jpeg",
        "/public/categories/orkeed/orkeed-3.jpeg",
        "/public/categories/orkeed/orkeed-4.jpeg",
    ],
    toleeb: [
        "/public/categories/toleeb/toleeb-1.jpeg",
        "/public/categories/toleeb/toleeb-2.jpeg",
        "/public/categories/toleeb/toleeb-3.jpeg",
    ],
};
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["saled"] = "saled";
    UnitStatus["reserved"] = "reserved";
    UnitStatus["avaliable"] = "avaliable";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
var UnitTypes;
(function (UnitTypes) {
    UnitTypes["villa"] = "villa";
    UnitTypes["townhouse"] = "townhouse";
})(UnitTypes || (exports.UnitTypes = UnitTypes = {}));
var UnitIntresetStatus;
(function (UnitIntresetStatus) {
    UnitIntresetStatus["buy"] = "buy";
    UnitIntresetStatus["reserve"] = "reserve";
    UnitIntresetStatus["intreset"] = "intreset";
})(UnitIntresetStatus || (exports.UnitIntresetStatus = UnitIntresetStatus = {}));
var UnitTemplates;
(function (UnitTemplates) {
    UnitTemplates["yasmin"] = "\u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646";
    UnitTemplates["lavender"] = "\u0644\u0627\u0641\u0646\u062F\u0631";
    UnitTemplates["orcid"] = "\u0627\u0648\u0631\u0643\u064A\u062F";
    UnitTemplates["tolib"] = "\u062A\u0648\u0644\u064A\u0628";
})(UnitTemplates || (exports.UnitTemplates = UnitTemplates = {}));
var UnitBuildStatus;
(function (UnitBuildStatus) {
    UnitBuildStatus["noConstruction"] = "no_construction";
    UnitBuildStatus["construction"] = "construction";
})(UnitBuildStatus || (exports.UnitBuildStatus = UnitBuildStatus = {}));
const UnitValidator = zod_1.z.object({
    // name: z.string(),
    projectId: zod_1.z.string(),
    number: zod_1.z.number(),
    // color: z.string(),
    price: zod_1.z.number(),
    landSpace: zod_1.z.number(),
    buildSpace: zod_1.z.number(),
    status: zod_1.z.nativeEnum(UnitStatus).default(UnitStatus.avaliable),
    bedroomNumber: zod_1.z.number(),
    bathroomNumber: zod_1.z.number(),
    videoUrl: zod_1.z.string().optional(),
    // floorsNumber: z.nullable().number(),
    advantages: zod_1.z.string().optional(),
    categoryId: zod_1.z.string(),
    type: zod_1.z.nativeEnum(UnitTypes),
    buildStatus: zod_1.z.nativeEnum(UnitBuildStatus),
    buildLevel: zod_1.z.number(),
    salesChannels: zod_1.z.array(zod_1.z.string()).optional().default([]),
    saledSpace: zod_1.z.number(),
    position_x: zod_1.z.number(),
    position_y: zod_1.z.number(),
});
exports.SetUnitStatusValidator = zod_1.z.object({
    status: zod_1.z.nativeEnum(UnitStatus),
});
exports.unitCategoryValidation = zod_1.z.object({
    name: zod_1.z.string(),
    color: zod_1.z.string(),
    // number: z.number(),
    status: zod_1.z.nativeEnum(enums_1.CommonStatus).default(enums_1.CommonStatus.archived),
    // unitId: z.string(),
});
exports.unitFloorValidation = zod_1.z.object({
    name: zod_1.z.string(),
    index: zod_1.z
        .string()
        .nonempty()
        .transform((val) => Number(val)),
    unitId: zod_1.z.string(),
    image: zod_1.z.string(),
});
exports.unitCategoryFloorUpdate = zod_1.z.object({
    name: zod_1.z.string(),
    index: zod_1.z
        .string()
        .nonempty()
        .transform((val) => Number(val)),
    image: zod_1.z.string(),
    categoryId: zod_1.z.string(),
});
exports.unitIntresetValidation = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    area: zod_1.z.string(),
    email: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    unitId: zod_1.z.string(),
});
exports.reverseUnitValidator = zod_1.z.object({
    intresetId: zod_1.z.string(),
    // price: z.number(),
});
exports.default = UnitValidator;
