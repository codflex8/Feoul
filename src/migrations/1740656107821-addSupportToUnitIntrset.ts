import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupportToUnitIntrset1740656107821 implements MigrationInterface {
    name = 'AddSupportToUnitIntrset1740656107821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`support\` enum ('supported', 'unsupported') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`support\`
        `);
    }

}
