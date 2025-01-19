import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSizeToUnit1737278283201 implements MigrationInterface {
    name = 'AddSizeToUnit1737278283201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`size\` text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`size\`
        `);
    }

}
