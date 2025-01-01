"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUnitIntresetStatus1735414060007 = void 0;
class AddUnitIntresetStatus1735414060007 {
    constructor() {
        this.name = 'AddUnitIntresetStatus1735414060007';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`status\` enum ('buy', 'reserve', 'intreset') NOT NULL DEFAULT 'intreset'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`status\` varchar(255) NULL
        `);
    }
}
exports.AddUnitIntresetStatus1735414060007 = AddUnitIntresetStatus1735414060007;
