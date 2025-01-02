"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNewColumsToUnit1735723227192 = void 0;
class AddNewColumsToUnit1735723227192 {
    constructor() {
        this.name = 'AddNewColumsToUnit1735723227192';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`type\` enum ('villa', 'townhouse') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildStatus\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildLevel\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`salesChannels\` text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`saledSpace\` int NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`saledSpace\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`salesChannels\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildLevel\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`type\`
        `);
    }
}
exports.AddNewColumsToUnit1735723227192 = AddNewColumsToUnit1735723227192;
