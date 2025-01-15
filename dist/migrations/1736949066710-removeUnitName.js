"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveUnitName1736949066710 = void 0;
class RemoveUnitName1736949066710 {
    constructor() {
        this.name = "RemoveUnitName1736949066710";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`name\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'posted'
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'posted'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived'
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\` CHANGE \`status\` \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived'
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`name\` varchar(255) NOT NULL
        `);
    }
}
exports.RemoveUnitName1736949066710 = RemoveUnitName1736949066710;
