import { UnitInterestService } from "./unitIntreset.service";

export class FinancialService {
  static async getFinancialStatistics() {
    const unitsIntresets = await UnitInterestService.getUnitInterests({
      financial: true,
    });
    return unitsIntresets;
  }
}
