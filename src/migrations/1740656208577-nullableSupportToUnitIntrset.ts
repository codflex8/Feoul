import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableSupportToUnitIntrset1740656208577 implements MigrationInterface {
    name = 'NullableSupportToUnitIntrset1740656208577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`support\` \`support\` enum ('supported', 'unsupported') NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`support\` \`support\` enum ('supported', 'unsupported') NOT NULL
        `);
    }

}
