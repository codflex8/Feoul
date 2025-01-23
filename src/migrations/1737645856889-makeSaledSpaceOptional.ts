import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeSaledSpaceOptional1737645856889 implements MigrationInterface {
    name = 'MakeSaledSpaceOptional1737645856889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`saledSpace\` \`saledSpace\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`saledSpace\` \`saledSpace\` int NOT NULL
        `);
    }

}
