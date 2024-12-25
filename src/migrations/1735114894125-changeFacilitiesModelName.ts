import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFacilitiesModelName1735114894125 implements MigrationInterface {
    name = 'ChangeFacilitiesModelName1735114894125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`project_facilities\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`lat\` varchar(255) NOT NULL,
                \`lng\` varchar(255) NOT NULL,
                \`projectId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD CONSTRAINT \`FK_fde33890372e8c7cf45a59bce5b\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP FOREIGN KEY \`FK_fde33890372e8c7cf45a59bce5b\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project_facilities\`
        `);
    }

}
