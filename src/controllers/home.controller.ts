import { Request, Response, NextFunction } from "express";
import { Project } from "../entities/Project.model";
import { Unit } from "../entities/Unit.model";
import { UnitIntreset } from "../entities/UnitIntreset.model";
export class HomeController {
  public static async index(req: Request, res: Response, next: NextFunction) {
    const projectsCount = await Project.count();
    const unitsCount = await Unit.count();
    const intresetCount = await UnitIntreset.count();
    const unitIntresetsData = await Unit.createQueryBuilder("unit")
      .leftJoin("unit.interests", "interests")
      .select("COUNT(interests.id)", "intresetsCount")
      .addSelect("unit.id", "unitId")
      .addSelect("unit.name", "unitName")
      .groupBy("unit.id")
      .getRawMany();

    res.status(200).json({
      projectsCount,
      unitsCount,
      intresetCount,
      unitIntresetsData,
    });
  }
}
