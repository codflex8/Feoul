"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNameToUnit1737306794746 = void 0;
class AddNameToUnit1737306794746 {
    constructor() {
        this.name = "AddNameToUnit1737306794746";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`name\` varchar(255) NULL
        `);
        // await queryRunner.query(`
        //     ALTER TABLE \`unit\`
        //     ADD \`position\` text NULL
        // `);
    }
    async down(queryRunner) {
        // await queryRunner.query(`
        //     ALTER TABLE \`unit\` DROP COLUMN \`position\`
        // `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`name\`
        `);
    }
}
exports.AddNameToUnit1737306794746 = AddNameToUnit1737306794746;
