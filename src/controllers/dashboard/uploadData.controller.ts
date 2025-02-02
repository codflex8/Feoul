import { Request, Response, NextFunction } from "express";
import XLSX from "xlsx";
import AppDataSource from "../../data-source";
import { Project } from "../../entities/Project.model";
import { Unit } from "../../entities/Unit.model";
import { UnitCategories } from "../../entities/UnitCategories.model";
import {
  UnitBuildStatus,
  UnitCategoriesNames,
  UnitStatus,
  UnitTemplates,
  UnitTypes,
} from "../../utils/validators/UnitValidator";
import { CommonStatus } from "../../utils/types/enums";
import { Equal } from "typeorm";
import { unitsData } from "../../old-units-data";
import { UnitFloor } from "../../entities/UnitFloor.model";
export class UploadData {
  private static getPrice(category: string) {
    if (category === UnitCategoriesNames.toleeb) {
      return 1145000;
    } else if (category === UnitCategoriesNames.orkeed) {
      return 111700;
    } else {
      return 902000;
    }
  }

  private static getFloorsImages(category: string) {
    if (category === UnitCategoriesNames.yasmeen) {
      return [
        {
          index: 0,
          name: "الطابق الارضي",
          imageUrl: "/public/floors/yasmeen/1.jpeg",
        },
        {
          index: 1,
          name: "الطابق الاول",
          imageUrl: "/public/floors/yasmeen/2.jpeg",
        },
        {
          index: 2,
          name: "الطابق الثاني",
          imageUrl: "/public/floors/yasmeen/3.jpeg",
        },
      ];
    }
    if (category === UnitCategoriesNames.orkeed) {
      return [
        {
          index: 0,
          name: "الطابق الارضي",
          imageUrl:
            "https://drive.google.com/file/d/1NQiryYBDdcm7Xx6KM322DILP3agceJ28/view?usp=share_link",
        },
        {
          index: 1,
          name: "الطابق الاول",
          imageUrl:
            "https://drive.google.com/file/d/1VwY6NlcB-eBBl9n-Xdb_2EmMgVBCZsCU/view?usp=share_link",
        },
        {
          index: 2,
          name: "الطابق الثاني",
          imageUrl:
            "https://drive.google.com/file/d/1YUfNc48Q1Rvusm_UBuDTt9gchoS3jSun/view?usp=share_link",
        },
      ];
    }
    if (category === UnitCategoriesNames.toleeb) {
      return [
        {
          index: 0,
          name: "الطابق الارضي",
          imageUrl: "/public/floors/toleeb/1.jpeg",
        },
        {
          index: 1,
          name: "الطابق الاول",
          imageUrl: "/public/floors/toleeb/2.jpeg",
        },
        {
          index: 2,
          name: "الطابق الثاني",
          imageUrl: "/public/floors/toleeb/3.jpeg",
        },
      ];
    }
    return [];
  }

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
        const categoryName =
          row["النموذج"]?.trim() ?? UnitCategoriesNames.yasmeen;
        const unitTemplate = row["النموذج"]?.trim() as UnitTemplates;

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
            lat: "21.740182275411662",
            lng: "39.22477929186214",
            city: "Jeddah", // Add default city or extract if available
          });
          await project.save();
          validProjects.push(project);
        }

        // Extract and map unit data
        const unitNumber = Number(row["رقم الفيلا"]);
        const unitType: UnitTypes = row["نوع الفيلا"]?.trim() as UnitTypes;
        // const unitPrice = parseFloat(row["سعر البيع"?.trim()]);
        const unitPrice = Number(UploadData.getPrice(categoryName));
        const buildLevel = parseFloat(row["المرحلة"?.trim()]);
        const landSpace = parseFloat(row["مساحة الارض"?.trim()]);
        const buildSpace = parseFloat(row["المساحة البيعية"?.trim()]);
        const bedroomNumber = parseInt(row["غرف النوم"]?.trim(), 10);
        const bathroomNumber = parseInt(row["دورة المياة "]?.trim(), 10);
        const buildStatusValue = row["حالة البناء"]?.trim();
        const buildStatus =
          buildStatusValue === UnitBuildStatus.construction
            ? UnitBuildStatus.construction
            : UnitBuildStatus.noConstruction;
        const salesChannels = row["sales_channels"]
          ?.trim()
          ?.replace(/[{}]/g, "")
          .split(",")
          .map((channel) => channel.trim());

        if (!unitNumber || !unitType || isNaN(unitPrice)) {
          errors.push(`Row ${index + 1}: Missing or invalid unit data.`);
          continue;
        }

        const floors = UploadData.getFloorsImages(categoryName);

        // Check for duplicate unit
        const existingUnit = await unitRepo.findOneBy({ number: unitNumber });
        if (existingUnit) {
          errors.push(`Row ${index + 1}: Duplicate unit number ${unitNumber}.`);
          continue;
        }
        // Pick a random value
        // const randomStatus =
        //   enumValues[Math.floor(Math.random() * enumValues.length)];
        let unitCategory = await UnitCategories.createQueryBuilder("category")
          .where("LOWER(category.name) LIKE LOWER(:name)", {
            name: `%${categoryName}%`,
          })
          .getOne();
        if (!unitCategory) {
          unitCategory = await UnitCategories.createQueryBuilder("category")
            .where("LOWER(category.name) LIKE LOWER(:name)", {
              name: `%${UnitCategoriesNames.yasmeen}%`,
            })
            .getOne();
        }
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
          name: `مبنى ${unitNumber}`,
          buildSpace,
          //   ToDo:add real values from sheet
          buildLevel,
          floorsNumber: 3,
          status: UnitStatus.avaliable,
          floors: UnitFloor.create(floors),
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
