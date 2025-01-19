"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPositionToUnit1737305764136 = void 0;
class AddPositionToUnit1737305764136 {
    constructor() {
        this.name = 'AddPositionToUnit1737305764136';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`position\` text NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`position\`
        `);
    }
}
exports.AddPositionToUnit1737305764136 = AddPositionToUnit1737305764136;
