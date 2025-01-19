import { Request, Response, NextFunction } from "express";
import XLSX from "xlsx";
import AppDataSource from "../../data-source";
import { Project } from "../../entities/Project.model";
import { Unit } from "../../entities/Unit.model";
import { UnitCategories } from "../../entities/UnitCategories.model";
import {
  UnitStatus,
  UnitTemplates,
  UnitTypes,
} from "../../utils/validators/UnitValidator";
import { CommonStatus } from "../../utils/types/enums";
import { Equal } from "typeorm";
import { unitsData } from "../../units-data";
export class UploadData {
  static async uploadData(req: Request, res: Response, next: NextFunction) {
    const file = req.file?.buffer;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
    }
    const buffer = file?.buffer;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheetData: Array<Record<string, string>> = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      {}
    );
    const trimmedData: Array<Record<string, string>> = sheetData.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key.trim(), value])
      )
    );
    const projectRepo = AppDataSource.getRepository(Project);
    const unitRepo = AppDataSource.getRepository(Unit);

    const validProjects: Project[] = [];
    const validUnits: Unit[] = [];
    const errors: string[] = [];
    for (const [index, row] of trimmedData.entries()) {
      try {
        const unitData = unitsData[index];
        // Extract and map project data
        const projectName = row["اسم المشروع"]?.trim();
        const unitTemplate: UnitTemplates = row[
          "النموذج"
        ]?.trim() as UnitTemplates;
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
        const isInValidProjects = validProjects.find(
          (proj) => proj.name === projectName.trim()
        );
        let project = isInValidProjects
          ? isInValidProjects
          : await projectRepo.findOne({
              where: { name: Equal(projectName.trim()) },
            });
        if (!project) {
          project = projectRepo.create({
            name: projectName,
            // ToDo: set real values from sheet after add it
            number: 1,
            status: CommonStatus.posted,
            lat: "21.771543",
            lng: "39.127317",
            city: "Jeddah", // Add default city or extract if available
          });
          await project.save();
          validProjects.push(project);
        }

        // Extract and map unit data
        const unitNumber = Number(row["رقم الفيلا"]);
        const unitType: UnitTypes = row["نوع الفيلا"]?.trim() as UnitTypes;
        const unitPrice = parseFloat(row["سعر البيع"?.trim()]);
        const landSpace = parseFloat(row["مساحة الارض"?.trim()]);
        const saledSpace = parseFloat(row["المساحة البيعية"?.trim()]);
        const bedroomNumber = parseInt(row["غرف النوم"]?.trim(), 10);
        const bathroomNumber = parseInt(row["دورة المياة "]?.trim(), 10);
        const buildStatus = row["حالة البناء"]?.trim();
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
        const enumValues = Object.values(UnitStatus);

        // Pick a random value
        const randomStatus =
          enumValues[Math.floor(Math.random() * enumValues.length)];
        const unitCategory = await UnitCategories.createQueryBuilder("category")
          .where("LOWER(category.name) LIKE LOWER(:name)", {
            name: `%${unitData.category}%`,
          })
          .getOne();
        console.log("unitCategoryyyyy", unitCategory);
        const unit = unitRepo.create({
          number: unitNumber,
          type: unitType,
          price: unitPrice,
          landSpace,
          saledSpace,
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
          //   ToDo:add real values from sheet
          buildLevel: 1,
          buildSpace: 200,
          floorsNumber: 3,
          status: randomStatus,
        });
        validUnits.push(unit);
      } catch (error: any) {
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
