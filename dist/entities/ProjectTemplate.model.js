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
exports.ProjectTemplate = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../utils/types/enums");
const Project_model_1 = require("./Project.model");
const BaseNumberModel_1 = require("./BaseNumberModel");
let ProjectTemplate = class ProjectTemplate extends BaseNumberModel_1.BaseNumberModel {
};
exports.ProjectTemplate = ProjectTemplate;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProjectTemplate.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.CommonStatus, default: enums_1.CommonStatus.archived }),
    __metadata("design:type", String)
], ProjectTemplate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_model_1.Project, (proj) => proj.template, {
        // cascade: true,
        onDelete: "SET NULL",
        onUpdate: "SET NULL",
    }),
    __metadata("design:type", Array)
], ProjectTemplate.prototype, "projects", void 0);
exports.ProjectTemplate = ProjectTemplate = __decorate([
    (0, typeorm_1.Entity)()
], ProjectTemplate);
