import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumsToUnit1735723227192 implements MigrationInterface {
    name = 'AddNewColumsToUnit1735723227192'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
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
