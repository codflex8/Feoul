"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFacilitiesModel1735110392760 = void 0;
class AddFacilitiesModel1735110392760 {
    constructor() {
        this.name = 'AddFacilitiesModel1735110392760';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`facilities\` (
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
            ALTER TABLE \`facilities\`
            ADD CONSTRAINT \`FK_948e7eb0d6c702aae9ea0cec5d8\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`facilities\` DROP FOREIGN KEY \`FK_948e7eb0d6c702aae9ea0cec5d8\`
        `);
        await queryRunner.query(`
            DROP TABLE \`facilities\`
        `);
    }
}
exports.AddFacilitiesModel1735110392760 = AddFacilitiesModel1735110392760;
