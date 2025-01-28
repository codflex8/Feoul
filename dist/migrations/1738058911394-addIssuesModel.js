"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIssuesModel1738058911394 = void 0;
class AddIssuesModel1738058911394 {
    constructor() {
        this.name = 'AddIssuesModel1738058911394';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`issues\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`phoneNumber\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`issues\`
        `);
    }
}
exports.AddIssuesModel1738058911394 = AddIssuesModel1738058911394;
