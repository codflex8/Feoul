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
exports.Unit = void 0;
const typeorm_1 = require("typeorm");
const Project_model_1 = require("./Project.model");
const UnitCategories_model_1 = require("./UnitCategories.model");
const UnitFloor_model_1 = require("./UnitFloor.model");
const UnitIntreset_model_1 = require("./UnitIntreset.model");
const UnitValidator_1 = require("../utils/validators/UnitValidator");
const BaseNumberModel_1 = require("./BaseNumberModel");
let Unit = class Unit extends BaseNumberModel_1.BaseNumberModel {
};
exports.Unit = Unit;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Unit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: UnitValidator_1.UnitTypes }),
    __metadata("design:type", String)
], Unit.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Unit.prototype, "buildStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "buildLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "simple-array",
        nullable: true,
    }),
    __metadata("design:type", Array)
], Unit.prototype, "salesChannels", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "saledSpace", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "landSpace", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "buildSpace", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: UnitValidator_1.UnitStatus, nullable: true }),
    __metadata("design:type", String)
], Unit.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "bedroomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "bathroomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Unit.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Unit.prototype, "floorsNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Unit.prototype, "advantages", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_model_1.Project, (project) => project.units, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Project_model_1.Project)
], Unit.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UnitCategories_model_1.UnitCategories, (unitCategory) => unitCategory.units, {
        onDelete: "SET NULL",
        onUpdate: "SET NULL",
    }),
    __metadata("design:type", UnitCategories_model_1.UnitCategories)
], Unit.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UnitFloor_model_1.UnitFloor, (floor) => floor.unit, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Unit.prototype, "floors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UnitIntreset_model_1.UnitIntreset, (interest) => interest.unit, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Unit.prototype, "interests", void 0);
exports.Unit = Unit = __decorate([
    (0, typeorm_1.Entity)()
], Unit);
