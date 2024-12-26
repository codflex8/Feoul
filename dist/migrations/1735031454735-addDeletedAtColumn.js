"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDeletedAtColumn1735031454735 = void 0;
class AddDeletedAtColumn1735031454735 {
    constructor() {
        this.name = 'AddDeletedAtColumn1735031454735';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`email\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_categories\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_floor\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_interest\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_interest\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_floor\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_categories\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`email\` varchar(255) NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)
        `);
    }
}
exports.AddDeletedAtColumn1735031454735 = AddDeletedAtColumn1735031454735;
