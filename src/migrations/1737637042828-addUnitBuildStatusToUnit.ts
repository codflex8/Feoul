import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitBuildStatusToUnit1737637042828 implements MigrationInterface {
    name = 'AddUnitBuildStatusToUnit1737637042828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildStatus\` enum ('no_construction', 'construction') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`buildStatus\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`buildStatus\` varchar(255) NOT NULL
        `);
    }

}
