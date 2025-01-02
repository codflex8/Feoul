import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueForSalesChannels1735725954234 implements MigrationInterface {
    name = 'SetDefaultValueForSalesChannels1735725954234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`salesChannels\` \`salesChannels\` text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`salesChannels\` \`salesChannels\` text NOT NULL
        `);
    }

}
