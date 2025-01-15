"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTemplateToUnit1736941783210 = void 0;
class AddTemplateToUnit1736941783210 {
    constructor() {
        this.name = "AddTemplateToUnit1736941783210";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`template\` enum ('الياسمين', 'لافندر', 'اوركيد', 'توليب') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`template\`
        `);
    }
}
exports.AddTemplateToUnit1736941783210 = AddTemplateToUnit1736941783210;
