"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCategories = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const enums_1 = require("../utils/types/enums");
const Unit_model_1 = require("./Unit.model");
let UnitCategories = class UnitCategories extends BaseModel_1.BaseModel {
};
exports.UnitCategories = UnitCategories;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UnitCategories.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UnitCategories.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UnitCategories.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.CommonStatus, default: enums_1.CommonStatus.archived }),
    __metadata("design:type", String)
], UnitCategories.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Unit_model_1.Unit, (unit) => unit.category, {
        onDelete: "SET NULL",
        onUpdate: "SET NULL",
    }),
    __metadata("design:type", Array)
], UnitCategories.prototype, "units", void 0);
exports.UnitCategories = UnitCategories = __decorate([
    (0, typeorm_1.Entity)()
], UnitCategories);
