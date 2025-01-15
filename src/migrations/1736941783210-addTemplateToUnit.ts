import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplateToUnit1736941783210 implements MigrationInterface {
  name = "AddTemplateToUnit1736941783210";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`template\` enum ('الياسمين', 'لافندر', 'اوركيد', 'توليب') NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`template\`
        `);
  }
}
