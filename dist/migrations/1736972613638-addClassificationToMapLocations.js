"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddClassificationToMapLocations1736972613638 = void 0;
class AddClassificationToMapLocations1736972613638 {
    constructor() {
        this.name = 'AddClassificationToMapLocations1736972613638';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\`
            ADD \`classification\` enum ('primary', 'secondary') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`map_locations\` DROP COLUMN \`classification\`
        `);
    }
}
exports.AddClassificationToMapLocations1736972613638 = AddClassificationToMapLocations1736972613638;
