"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSizeToUnit1737278283201 = void 0;
class AddSizeToUnit1737278283201 {
    constructor() {
        this.name = 'AddSizeToUnit1737278283201';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`size\` text NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`size\`
        `);
    }
}
exports.AddSizeToUnit1737278283201 = AddSizeToUnit1737278283201;
