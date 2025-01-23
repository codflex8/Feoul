"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeSaledSpaceOptional1737645856889 = void 0;
class MakeSaledSpaceOptional1737645856889 {
    constructor() {
        this.name = 'MakeSaledSpaceOptional1737645856889';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`saledSpace\` \`saledSpace\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`saledSpace\` \`saledSpace\` int NOT NULL
        `);
    }
}
exports.MakeSaledSpaceOptional1737645856889 = MakeSaledSpaceOptional1737645856889;
