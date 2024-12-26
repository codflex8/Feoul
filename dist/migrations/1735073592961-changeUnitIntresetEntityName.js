"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUnitIntresetEntityName1735073592961 = void 0;
class ChangeUnitIntresetEntityName1735073592961 {
    constructor() {
        this.name = 'ChangeUnitIntresetEntityName1735073592961';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`unit_intreset\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`phoneNumber\` varchar(255) NOT NULL,
                \`area\` varchar(255) NOT NULL,
                \`email\` varchar(255) NULL,
                \`status\` varchar(255) NULL,
                \`unitId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD CONSTRAINT \`FK_3eb2406c0205cd5bbd1b1ee7d12\` FOREIGN KEY (\`unitId\`) REFERENCES \`unit\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP FOREIGN KEY \`FK_3eb2406c0205cd5bbd1b1ee7d12\`
        `);
        await queryRunner.query(`
            DROP TABLE \`unit_intreset\`
        `);
    }
}
exports.ChangeUnitIntresetEntityName1735073592961 = ChangeUnitIntresetEntityName1735073592961;
