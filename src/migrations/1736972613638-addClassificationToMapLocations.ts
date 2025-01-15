import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClassificationToMapLocations1736972613638 implements MigrationInterface {
    name = 'AddClassificationToMapLocations1736972613638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`classification\` enum ('primary', 'secondary') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`classification\`
        `);
    }

}
