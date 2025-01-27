import { Unit } from "../entities/Unit.model";
import { getPaginationData } from "../utils/getPaginationData";
import { UnitIntresetStatus } from "../utils/validators/UnitValidator";
import { UnitInterestService } from "./unitIntreset.service";

export class FinancialService {
  static async getFinancialStatistics(page = 1, pageSize = 10) {
    const { skip, take } = getPaginationData({ page, pageSize });
    return await Unit.createQueryBuilder("unit")
      .leftJoinAndSelect(
        "unit.interests",
        "interests"
        // "interests.status = :intreset",
        // { intreset: UnitIntresetStatus.buy }
      )
      .where("interests.status = :intreset", {
        intreset: UnitIntresetStatus.buy,
      })
      .select(["unit.id", "unit.number", "unit.price", "unit.name"])
      .addSelect("interests")
      .skip(skip)
      .take(take)
      .getManyAndCount();
    // return [unitsIntresets, count];
  }
}
