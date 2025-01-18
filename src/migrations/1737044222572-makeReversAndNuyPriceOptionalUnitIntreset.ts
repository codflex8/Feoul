import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeReversAndNuyPriceOptionalUnitIntreset1737044222572 implements MigrationInterface {
    name = 'MakeReversAndNuyPriceOptionalUnitIntreset1737044222572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`reversePrice\` \`reversePrice\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`buyPrice\` \`buyPrice\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`buyPrice\` \`buyPrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`reversePrice\` \`reversePrice\` int NOT NULL
        `);
    }

}
