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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const Unit_model_1 = require("./Unit.model");
const enums_1 = require("../utils/types/enums");
const ProjectTemplate_model_1 = require("./ProjectTemplate.model");
const ProjectFacilities_model_1 = require("./ProjectFacilities.model");
const BaseNumberModel_1 = require("./BaseNumberModel");
let Project = class Project extends BaseNumberModel_1.BaseNumberModel {
    static async getProjectByNumber(number) {
        const project = await this.findOneBy({ number });
        return project;
    }
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.CommonStatus, default: enums_1.CommonStatus.archived }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "projectDocUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Unit_model_1.Unit, (unit) => unit.project, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Project.prototype, "units", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProjectTemplate_model_1.ProjectTemplate, {
        onDelete: "SET NULL",
        onUpdate: "SET NULL",
    }),
    __metadata("design:type", ProjectTemplate_model_1.ProjectTemplate)
], Project.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProjectFacilities_model_1.ProjectFacilities, (fac) => fac.project, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Project.prototype, "facilities", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
