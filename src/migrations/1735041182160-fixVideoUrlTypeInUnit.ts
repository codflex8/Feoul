import { MigrationInterface, QueryRunner } from "typeorm";

export class FixVideoUrlTypeInUnit1735041182160 implements MigrationInterface {
    name = 'FixVideoUrlTypeInUnit1735041182160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`videoUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`videoUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP COLUMN \`videoUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD \`videoUrl\` int NULL
        `);
    }

}
