import { MigrationInterface, QueryRunner } from "typeorm";

export class InitModels1734811560899 implements MigrationInterface {
    name = 'InitModels1734811560899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`email\` varchar(255) NULL,
                \`phoneNumber\` varchar(255) NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`imageUrl\` varchar(255) NULL,
                \`role\` enum ('Admin', 'Employee') NOT NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                UNIQUE INDEX \`IDX_1e3d0240b49c40521aaeb95329\` (\`phoneNumber\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`project\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`number\` int NOT NULL,
                \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived',
                \`projectDocUrl\` varchar(255) NULL,
                \`city\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`unit_categories\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`color\` varchar(255) NOT NULL,
                \`number\` int NOT NULL,
                \`status\` enum ('archived', 'posted', 'deleted') NOT NULL DEFAULT 'archived',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`unit_floor\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`index\` int NOT NULL,
                \`imageUrl\` varchar(255) NULL,
                \`unitId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`unit_interest\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`phoneNumber\` varchar(255) NOT NULL,
                \`area\` varchar(255) NOT NULL,
                \`email\` varchar(255) NULL,
                \`status\` varchar(255) NULL,
                \`unitId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`unit\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`number\` int NOT NULL,
                \`color\` varchar(255) NOT NULL,
                \`price\` int NOT NULL,
                \`landSpace\` int NOT NULL,
                \`buildSpace\` int NOT NULL,
                \`status\` varchar(255) NULL,
                \`bedroomNumber\` int NOT NULL,
                \`bathroomNumber\` int NOT NULL,
                \`videoUrl\` int NULL,
                \`floorsNumber\` int NOT NULL,
                \`advantages\` varchar(255) NULL,
                \`projectId\` varchar(36) NULL,
                \`categoryId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_floor\`
            ADD CONSTRAINT \`FK_60693208c86e749f8da94e3a5c5\` FOREIGN KEY (\`unitId\`) REFERENCES \`unit\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_interest\`
            ADD CONSTRAINT \`FK_bc94761f6b367a71d44af07d08a\` FOREIGN KEY (\`unitId\`) REFERENCES \`unit\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD CONSTRAINT \`FK_081a1021523202d85962a6ef10c\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\`
            ADD CONSTRAINT \`FK_6b7d4a7b16eec49b852a59caf8f\` FOREIGN KEY (\`categoryId\`) REFERENCES \`unit_categories\`(\`id\`) ON DELETE
            SET NULL ON UPDATE
            SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP FOREIGN KEY \`FK_6b7d4a7b16eec49b852a59caf8f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit\` DROP FOREIGN KEY \`FK_081a1021523202d85962a6ef10c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_interest\` DROP FOREIGN KEY \`FK_bc94761f6b367a71d44af07d08a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_floor\` DROP FOREIGN KEY \`FK_60693208c86e749f8da94e3a5c5\`
        `);
        await queryRunner.query(`
            DROP TABLE \`unit\`
        `);
        await queryRunner.query(`
            DROP TABLE \`unit_interest\`
        `);
        await queryRunner.query(`
            DROP TABLE \`unit_floor\`
        `);
        await queryRunner.query(`
            DROP TABLE \`unit_categories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
