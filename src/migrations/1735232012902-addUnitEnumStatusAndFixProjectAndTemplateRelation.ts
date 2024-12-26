import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitEnumStatusAndFixProjectAndTemplateRelation1735232012902 implements MigrationInterface {
    name = 'AddUnitEnumStatusAndFixProjectAndTemplateRelation1735232012902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project_template\` DROP FOREIGN KEY \`FK_d70f32a13006c2dc1ca2be8cc51\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\` DROP COLUMN \`projectId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`templateId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_996e9dc3633d1cb56dc58b4a616\` FOREIGN KEY (\`templateId\`) REFERENCES \`project_template\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_996e9dc3633d1cb56dc58b4a616\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`templateId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\`
            ADD \`projectId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_template\`
            ADD CONSTRAINT \`FK_d70f32a13006c2dc1ca2be8cc51\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

}
