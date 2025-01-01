import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColorFromUnit1735542732843 implements MigrationInterface {
    name = 'RemoveColorFromUnit1735542732843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`color\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`color\` varchar(255) NOT NULL
        `);
    }

}
