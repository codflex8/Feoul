"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRoleDefaultValuUserModel1735327995095 = void 0;
class SetRoleDefaultValuUserModel1735327995095 {
    constructor() {
        this.name = 'SetRoleDefaultValuUserModel1735327995095';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('Admin', 'Employee') NOT NULL DEFAULT 'Employee'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('Admin', 'Employee') NOT NULL
        `);
    }
}
exports.SetRoleDefaultValuUserModel1735327995095 = SetRoleDefaultValuUserModel1735327995095;
