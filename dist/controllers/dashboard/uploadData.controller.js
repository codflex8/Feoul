"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadData = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const data_source_1 = __importDefault(require("../../data-source"));
const Project_model_1 = require("../../entities/Project.model");
const Unit_model_1 = require("../../entities/Unit.model");
const UnitCategories_model_1 = require("../../entities/UnitCategories.model");
const UnitValidator_1 = require("../../utils/validators/UnitValidator");
const enums_1 = require("../../utils/types/enums");
const typeorm_1 = require("typeorm");
const units_data_1 = require("../../units-data");
const UnitFloor_model_1 = require("../../entities/UnitFloor.model");
class UploadData {
    static async uploadData(req, res, next) {
        const file = req.file?.buffer;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
        }
        const buffer = file?.buffer;
        const workbook = xlsx_1.default.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0]; // First sheet
        const sheetData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName], {});
        const trimmedData = sheetData.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.trim(), value])));
        const projectRepo = data_source_1.default.getRepository(Project_model_1.Project);
        const unitRepo = data_source_1.default.getRepository(Unit_model_1.Unit);
        const validProjects = [];
        const validUnits = [];
        const errors = [];
        for (const [index, row] of trimmedData.entries()) {
            try {
                const unitData = units_data_1.unitsData[index];
                // Extract and map project data
                const projectName = row["اسم المشروع"]?.trim();
                const unitTemplate = row["النموذج"]?.trim();
                // let unitCategory = await UnitCategories.findOne({
                //     name: unitCategoryName,
                // });
                // if (!unitCategory) {
                //   unitCategory = UnitCategories.create({
                //     name: unitCategoryName,
                //   });
                // }
                if (!projectName) {
                    errors.push(`Row ${index + 1}: Missing project name.`);
                    continue;
                }
                const isInValidProjects = validProjects.find((proj) => proj.name === projectName.trim());
                let project = isInValidProjects
                    ? isInValidProjects
                    : await projectRepo.findOne({
                        where: { name: (0, typeorm_1.Equal)(projectName.trim()) },
                    });
                if (!project) {
                    project = projectRepo.create({
                        name: projectName,
                        // ToDo: set real values from sheet after add it
                        number: 1,
                        status: enums_1.CommonStatus.posted,
                        lat: "21.740182275411662",
                        lng: "39.22477929186214",
                        city: "Jeddah", // Add default city or extract if available
                    });
                    await project.save();
                    validProjects.push(project);
                }
                // Extract and map unit data
                const unitNumber = Number(row["رقم الفيلا"]);
                const unitType = row["نوع الفيلا"]?.trim();
                const unitPrice = parseFloat(row["سعر البيع"?.trim()]);
                const buildLevel = parseFloat(row["المرحلة"?.trim()]);
                const landSpace = parseFloat(row["مساحة الارض"?.trim()]);
                const buildSpace = parseFloat(row["المساحة البيعية"?.trim()]);
                const bedroomNumber = parseInt(row["غرف النوم"]?.trim(), 10);
                const bathroomNumber = parseInt(row["دورة المياة "]?.trim(), 10);
                const buildStatusValue = row["حالة البناء"]?.trim();
                const buildStatus = buildStatusValue === UnitValidator_1.UnitBuildStatus.construction
                    ? UnitValidator_1.UnitBuildStatus.construction
                    : UnitValidator_1.UnitBuildStatus.noConstruction;
                const salesChannels = row["sales_channels"]
                    ?.trim()
                    ?.replace(/[{}]/g, "")
                    .split(",")
                    .map((channel) => channel.trim());
                if (!unitNumber || !unitType || isNaN(unitPrice)) {
                    errors.push(`Row ${index + 1}: Missing or invalid unit data.`);
                    continue;
                }
                // Check for duplicate unit
                const existingUnit = await unitRepo.findOneBy({ number: unitNumber });
                if (existingUnit) {
                    errors.push(`Row ${index + 1}: Duplicate unit number ${unitNumber}.`);
                    continue;
                }
                const enumValues = Object.values(UnitValidator_1.UnitStatus);
                // Pick a random value
                // const randomStatus =
                //   enumValues[Math.floor(Math.random() * enumValues.length)];
                const unitCategory = await UnitCategories_model_1.UnitCategories.createQueryBuilder("category")
                    .where("LOWER(category.name) LIKE LOWER(:name)", {
                    name: `%${unitData.category}%`,
                })
                    .getOne();
                const unit = unitRepo.create({
                    number: unitNumber,
                    type: unitType,
                    price: unitPrice,
                    landSpace,
                    // saledSpace,
                    bedroomNumber,
                    bathroomNumber,
                    buildStatus,
                    salesChannels,
                    project,
                    template: unitTemplate,
                    category: unitCategory ?? undefined,
                    size: unitData.size,
                    position: unitData.position,
                    name: unitData.name,
                    buildSpace,
                    //   ToDo:add real values from sheet
                    buildLevel,
                    floorsNumber: 3,
                    status: UnitValidator_1.UnitStatus.avaliable,
                    floors: UnitFloor_model_1.UnitFloor.create([
                        {
                            index: 0,
                            name: "first floor",
                            imageUrl: "/public/default/Type_A_GF.png",
                        },
                        {
                            index: 1,
                            name: "first floor",
                            imageUrl: "/public/default/Type_A_FF.png",
                        },
                        {
                            index: 2,
                            name: "first floor",
                            imageUrl: "/public/default/Type_A_RF.png",
                        },
                    ]),
                });
                validUnits.push(unit);
            }
            catch (error) {
                errors.push(`Row ${index + 1}: ${error.message}`);
            }
        }
        // Save valid projects and units
        if (validProjects.length > 0) {
            await projectRepo.save(validProjects);
        }
        if (validUnits.length > 0) {
            await unitRepo.save(validUnits);
        }
        res.status(200).json({
            message: "File processed successfully",
            projectsAdded: validProjects.length,
            unitsAdded: validUnits.length,
            errors,
        });
    }
}
exports.UploadData = UploadData;
