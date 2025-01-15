import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeLatAndLngFloat1736959710406 implements MigrationInterface {
    name = 'MakeLatAndLngFloat1736959710406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`buildLevel\` \`buildLevel\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lat\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lng\` float NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lng\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lat\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`buildLevel\` \`buildLevel\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` int NOT NULL
        `);
    }

}
