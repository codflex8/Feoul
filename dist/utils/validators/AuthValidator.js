"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidator = exports.LanguageEnum = exports.GenderEnum = void 0;
const zod_1 = require("zod");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var LanguageEnum;
(function (LanguageEnum) {
    LanguageEnum["english"] = "en";
    LanguageEnum["arabic"] = "ar";
})(LanguageEnum || (exports.LanguageEnum = LanguageEnum = {}));
exports.signInValidator = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
