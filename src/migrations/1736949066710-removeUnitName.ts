import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUnitName1736949066710 implements MigrationInterface {
  name = "RemoveUnitName1736949066710";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`name\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`project_template\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'posted'
        `);
    await queryRunner.query(`
            ALTER TABLE \`project\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'posted'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`project\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived'
        `);
    await queryRunner.query(`
            ALTER TABLE \`project_template\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived'
        `);
    await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`name\` varchar(255) NOT NULL
        `);
  }
}
