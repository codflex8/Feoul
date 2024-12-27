import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullOnDeleteProjectTemplate1735328644396 implements MigrationInterface {
    name = 'SetNullOnDeleteProjectTemplate1735328644396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_996e9dc3633d1cb56dc58b4a616\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_996e9dc3633d1cb56dc58b4a616\` FOREIGN KEY (\`templateId\`) REFERENCES \`project_template\`(\`id\`) ON DELETE
            SET NULL ON UPDATE
            SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_996e9dc3633d1cb56dc58b4a616\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_996e9dc3633d1cb56dc58b4a616\` FOREIGN KEY (\`templateId\`) REFERENCES \`project_template\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

}
