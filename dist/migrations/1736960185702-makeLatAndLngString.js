"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeLatAndLngString1736960185702 = void 0;
class MakeLatAndLngString1736960185702 {
    constructor() {
        this.name = 'MakeLatAndLngString1736960185702';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lat\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lng\` varchar(255) NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lng\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`lat\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` float NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` float NOT NULL
        `);
    }
}
exports.MakeLatAndLngString1736960185702 = MakeLatAndLngString1736960185702;
