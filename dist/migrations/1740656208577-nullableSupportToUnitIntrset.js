"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullableSupportToUnitIntrset1740656208577 = void 0;
class NullableSupportToUnitIntrset1740656208577 {
    constructor() {
        this.name = 'NullableSupportToUnitIntrset1740656208577';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`support\` \`support\` enum ('supported', 'unsupported') NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`support\` \`support\` enum ('supported', 'unsupported') NOT NULL
        `);
    }
}
exports.NullableSupportToUnitIntrset1740656208577 = NullableSupportToUnitIntrset1740656208577;
