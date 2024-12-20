"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitMigration1734707987833 = void 0;
class InitMigration1734707987833 {
    constructor() {
        this.name = "InitMigration1734707987833";
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, \`email\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`googleId\` varchar(255) NULL, \`facebookId\` varchar(255) NULL, \`twitterId\` varchar(255) NULL, \`birthDate\` datetime NULL, \`gender\` enum ('male', 'female') NULL, \`imageUrl\` varchar(255) NULL, \`verifyEmail\` tinyint NOT NULL DEFAULT 0, \`verifyCode\` int NULL, \`passwordChangedAt\` datetime NULL, \`passwordResetCode\` int NULL, \`passwordResetExpires\` datetime NULL, \`passwordResetVerified\` tinyint NOT NULL DEFAULT 0, \`language\` enum ('en', 'ar') NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_1e3d0240b49c40521aaeb95329\` (\`phoneNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_1e3d0240b49c40521aaeb95329\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.InitMigration1734707987833 = InitMigration1734707987833;
