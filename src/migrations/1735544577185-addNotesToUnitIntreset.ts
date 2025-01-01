import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesToUnitIntreset1735544577185 implements MigrationInterface {
    name = 'AddNotesToUnitIntreset1735544577185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`reversePrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`buyPrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\`
            ADD \`notes\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`notes\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`buyPrice\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` DROP COLUMN \`reversePrice\`
        `);
    }

}
