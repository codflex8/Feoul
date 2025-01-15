"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeLatAndLngFloat1736959710406 = void 0;
class MakeLatAndLngFloat1736959710406 {
    constructor() {
        this.name = 'MakeLatAndLngFloat1736959710406';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.MakeLatAndLngFloat1736959710406 = MakeLatAndLngFloat1736959710406;
