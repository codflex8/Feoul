import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUnit1737306794746 implements MigrationInterface {
  name = "AddNameToUnit1737306794746";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`name\` varchar(255) NULL
        `);
    // await queryRunner.query(`
    //     ALTER TABLE \`unit\`
    //     ADD \`position\` text NULL
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //     ALTER TABLE \`unit\` DROP COLUMN \`position\`
    // `);
    await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`name\`
        `);
  }
}
