"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeFacilitiesModelName1735114894125 = void 0;
class ChangeFacilitiesModelName1735114894125 {
    constructor() {
        this.name = 'ChangeFacilitiesModelName1735114894125';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`project_facilities\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`lat\` varchar(255) NOT NULL,
                \`lng\` varchar(255) NOT NULL,
                \`projectId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD CONSTRAINT \`FK_fde33890372e8c7cf45a59bce5b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP FOREIGN KEY \`FK_fde33890372e8c7cf45a59bce5b\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project_facilities\`
        `);
    }
}
exports.ChangeFacilitiesModelName1735114894125 = ChangeFacilitiesModelName1735114894125;
