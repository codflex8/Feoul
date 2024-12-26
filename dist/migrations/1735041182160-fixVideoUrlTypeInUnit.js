"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixVideoUrlTypeInUnit1735041182160 = void 0;
class FixVideoUrlTypeInUnit1735041182160 {
    constructor() {
        this.name = 'FixVideoUrlTypeInUnit1735041182160';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`videoUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`videoUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`videoUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`videoUrl\` int NULL
        `);
    }
}
exports.FixVideoUrlTypeInUnit1735041182160 = FixVideoUrlTypeInUnit1735041182160;
