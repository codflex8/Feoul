"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNotesToUnitIntreset1735544577185 = void 0;
class AddNotesToUnitIntreset1735544577185 {
    constructor() {
        this.name = 'AddNotesToUnitIntreset1735544577185';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`reversePrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`buyPrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`notes\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`notes\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`buyPrice\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`reversePrice\`
        `);
    }
}
exports.AddNotesToUnitIntreset1735544577185 = AddNotesToUnitIntreset1735544577185;
