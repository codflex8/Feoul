"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProjectTemplateAndProjectRelation1735047636999 = void 0;
class AddProjectTemplateAndProjectRelation1735047636999 {
    constructor() {
        this.name = 'AddProjectTemplateAndProjectRelation1735047636999';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`project_template\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`number\` int NOT NULL,
                \`link\` varchar(255) NULL,
                \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived',
                \`projectId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\`
            ADD CONSTRAINT \`FK_d70f32a13006c2dc1ca2be8cc51\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project_template\` DROP FOREIGN KEY \`FK_d70f32a13006c2dc1ca2be8cc51\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project_template\`
        `);
    }
}
exports.AddProjectTemplateAndProjectRelation1735047636999 = AddProjectTemplateAndProjectRelation1735047636999;
