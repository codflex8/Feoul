"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSupportToUnitIntrset1740656107821 = void 0;
class AddSupportToUnitIntrset1740656107821 {
    constructor() {
        this.name = 'AddSupportToUnitIntrset1740656107821';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`support\` enum ('supported', 'unsupported') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`support\`
        `);
    }
}
exports.AddSupportToUnitIntrset1740656107821 = AddSupportToUnitIntrset1740656107821;
