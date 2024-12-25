import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeLatAndLngFacilitiesModel1735115542029 implements MigrationInterface {
    name = 'ChangeLatAndLngFacilitiesModel1735115542029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` varchar(255) NOT NULL
        `);
    }

}
