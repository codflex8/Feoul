"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDefaultRecords1736948492805 = void 0;
const typeorm_1 = require("typeorm");
const UnitCategories_model_1 = require("../entities/UnitCategories.model");
const enums_1 = require("../utils/types/enums");
class AddDefaultRecords1736948492805 {
    async up(queryRunner) {
        const unitCategoryRepository = UnitCategories_model_1.UnitCategories.getRepository();
        // Insert categories using the query builder
        await unitCategoryRepository.save([
            {
                number: 1,
                name: "اوركيد",
                color: "#00CEC9",
                status: enums_1.CommonStatus.posted,
            },
            {
                number: 2,
                name: "توليب",
                color: "rgb(153, 182, 255)",
                status: enums_1.CommonStatus.posted,
            },
            {
                number: 3,
                name: "الياسمين",
                color: "rgb(213, 121, 255)",
                status: enums_1.CommonStatus.posted,
            },
        ]);
    }
    async down(queryRunner) {
        const unitCategoryRepository = UnitCategories_model_1.UnitCategories.getRepository();
        // Remove the categories by their names
        await UnitCategories_model_1.UnitCategories.delete({
            name: (0, typeorm_1.In)(["اوركيد", "توليب", "الياسمين"]),
        });
    }
}
exports.AddDefaultRecords1736948492805 = AddDefaultRecords1736948492805;
