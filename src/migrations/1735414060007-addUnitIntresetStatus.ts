import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitIntresetStatus1735414060007 implements MigrationInterface {
    name = 'AddUnitIntresetStatus1735414060007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`status\` enum ('buy', 'reserve', 'intreset') NOT NULL DEFAULT 'intreset'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`status\` varchar(255) NULL
        `);
    }

}
