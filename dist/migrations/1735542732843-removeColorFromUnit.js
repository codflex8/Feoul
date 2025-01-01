"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveColorFromUnit1735542732843 = void 0;
class RemoveColorFromUnit1735542732843 {
    constructor() {
        this.name = 'RemoveColorFromUnit1735542732843';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`color\`
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`color\` varchar(255) NOT NULL
        `);
    }
}
exports.RemoveColorFromUnit1735542732843 = RemoveColorFromUnit1735542732843;
