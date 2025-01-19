import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionToUnit1737305764136 implements MigrationInterface {
    name = 'AddPositionToUnit1737305764136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`position\` text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`position\`
        `);
    }

}
