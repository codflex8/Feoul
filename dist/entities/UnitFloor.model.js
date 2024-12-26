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
exports.UnitFloor = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Unit_model_1 = require("./Unit.model");
let UnitFloor = class UnitFloor extends BaseModel_1.BaseModel {
};
exports.UnitFloor = UnitFloor;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UnitFloor.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UnitFloor.prototype, "index", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UnitFloor.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Unit_model_1.Unit, (unit) => unit.floors, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Unit_model_1.Unit)
], UnitFloor.prototype, "unit", void 0);
exports.UnitFloor = UnitFloor = __decorate([
    (0, typeorm_1.Entity)()
], UnitFloor);
