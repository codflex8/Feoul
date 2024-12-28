import { BaseQuery } from "../utils/types/types";
import { Project } from "../entities/Project.model";
import { Unit } from "../entities/Unit.model";
import { UnitIntreset } from "../entities/UnitIntreset.model";
import { getPaginationData } from "../utils/getPaginationData";

interface DashboardData {
  projectsCount: number;
  unitsCount: number;
  intresetCount: number;
  unitIntresetsData: any[];
  lastIntresets: Unit[];
}

export class HomeService {
  static async getDashboardData(query: BaseQuery): Promise<DashboardData> {
    const { page, pageSize } = query;
    const { skip, take } = getPaginationData({ page, pageSize });

    const [
      projectsCount,
      unitsCount,
      intresetCount,
      unitIntresetsData,
      lastIntresets,
    ] = await Promise.all([
      Project.count(),
      Unit.count(),
      UnitIntreset.count(),
      Unit.createQueryBuilder("unit")
        .leftJoin("unit.interests", "interests")
        .select("COUNT(interests.id)", "intresetsCount")
        .addSelect("unit.id", "unitId")
        .addSelect("unit.name", "unitName")
        .groupBy("unit.id")
        .getRawMany(),
      Unit.createQueryBuilder("unit")
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
        .getMany(),
    ]);

    return {
      projectsCount,
      unitsCount,
      intresetCount,
      unitIntresetsData,
      lastIntresets,
    };
  }
}
