import { Request, Response, NextFunction } from "express";
import { Project } from "../entities/Project.model";
import { Unit } from "../entities/Unit.model";
import { UnitIntreset } from "../entities/UnitIntreset.model";
import { getPaginationData } from "../utils/getPaginationData";
import { BaseQuery } from "../utils/types/types";
export class HomeController {
  public static async index(
    req: Request<{}, {}, {}, BaseQuery>,
    res: Response,
    next: NextFunction
  ) {
    const { page, pageSize } = req.query;
    const { skip, take } = getPaginationData({ page, pageSize });
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

    const lastIntresets = await Unit.createQueryBuilder("unit")
      .leftJoin("unit.interests", "interests")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(interests.id)", "intresetsCount")
          .from("UnitIntreset", "interests")
          .where("interests.unitId = unit.id");
      }, "intresetsCount")
      .orderBy("intresetsCount", "ASC")
      .skip(skip)
      .take(take)
      .getMany();

    res.status(200).json({
      projectsCount,
      unitsCount,
      intresetCount,
      unitIntresetsData,
      lastIntresets,
    });
  }
}
