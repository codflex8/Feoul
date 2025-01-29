import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNumberInUnitCategory1737976369198
  implements MigrationInterface
{
  name = "RemoveNumberInUnitCategory1737976369198";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //         ALTER TABLE \`unit_categories\` DROP COLUMN \`number\`
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //         ALTER TABLE \`unit_categories\`
    //         ADD \`number\` int NOT NULL
    //     `);
  }
}
