"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNullOnDeleteProjectTemplate1735328644396 = void 0;
class SetNullOnDeleteProjectTemplate1735328644396 {
    constructor() {
        this.name = 'SetNullOnDeleteProjectTemplate1735328644396';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_996e9dc3633d1cb56dc58b4a616\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_996e9dc3633d1cb56dc58b4a616\` FOREIGN KEY (\`templateId\`) REFERENCES \`project_template\`(\`id\`) ON DELETE
            SET NULL ON UPDATE
            SET NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_996e9dc3633d1cb56dc58b4a616\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_996e9dc3633d1cb56dc58b4a616\` FOREIGN KEY (\`templateId\`) REFERENCES \`project_template\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
}
exports.SetNullOnDeleteProjectTemplate1735328644396 = SetNullOnDeleteProjectTemplate1735328644396;
