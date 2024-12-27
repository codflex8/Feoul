import { MigrationInterface, QueryRunner } from "typeorm";

export class SetRoleDefaultValuUserModel1735327995095 implements MigrationInterface {
    name = 'SetRoleDefaultValuUserModel1735327995095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('Admin', 'Employee') NOT NULL DEFAULT 'Employee'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('Admin', 'Employee') NOT NULL
        `);
    }

}
