import { In, MigrationInterface, QueryRunner } from "typeorm";
import { UnitCategories } from "../entities/UnitCategories.model";
import { CommonStatus } from "../utils/types/enums";

export class AddDefaultRecords1736948492805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const unitCategoryRepository = UnitCategories.getRepository();

    // Insert categories using the query builder
    await unitCategoryRepository.save([
      {
        number: 1,
        name: "class-A",
        color: "#00CEC9",
        status: CommonStatus.posted,
      },
      {
        number: 2,
        name: "class-B",
        color: "rgb(153, 182, 255)",
        status: CommonStatus.posted,
      },
      {
        number: 3,
        name: "class-C",
        color: "rgb(213, 121, 255)",
        status: CommonStatus.posted,
      },
      {
        number: 4,
        name: "class-D",
        color: "rgb(233, 214, 109)",
        status: CommonStatus.posted,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const unitCategoryRepository = UnitCategories.getRepository();

    // Remove the categories by their names
    await UnitCategories.delete({
      name: In(["A-1", "A-2", "B", "C"]),
    });
  }
}
