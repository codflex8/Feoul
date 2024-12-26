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
exports.ProjectFacilities = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Project_model_1 = require("./Project.model");
let ProjectFacilities = class ProjectFacilities extends BaseModel_1.BaseModel {
};
exports.ProjectFacilities = ProjectFacilities;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectFacilities.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProjectFacilities.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProjectFacilities.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_model_1.Project, (project) => project.facilities, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Project_model_1.Project)
], ProjectFacilities.prototype, "project", void 0);
exports.ProjectFacilities = ProjectFacilities = __decorate([
    (0, typeorm_1.Entity)()
], ProjectFacilities);
