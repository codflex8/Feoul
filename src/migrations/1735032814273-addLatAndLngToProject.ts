import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatAndLngToProject1735032814273 implements MigrationInterface {
    name = 'AddLatAndLngToProject1735032814273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
    }

}
