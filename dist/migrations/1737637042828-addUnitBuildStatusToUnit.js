"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUnitBuildStatusToUnit1737637042828 = void 0;
class AddUnitBuildStatusToUnit1737637042828 {
    constructor() {
        this.name = 'AddUnitBuildStatusToUnit1737637042828';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildStatus\` enum ('no_construction', 'construction') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildStatus\` varchar(255) NOT NULL
        `);
    }
}
exports.AddUnitBuildStatusToUnit1737637042828 = AddUnitBuildStatusToUnit1737637042828;
