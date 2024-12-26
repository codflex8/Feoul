"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLatAndLngToProject1735032814273 = void 0;
class AddLatAndLngToProject1735032814273 {
    constructor() {
        this.name = 'AddLatAndLngToProject1735032814273';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lng\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD \`lat\` int NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP COLUMN \`lng\`
        `);
    }
}
exports.AddLatAndLngToProject1735032814273 = AddLatAndLngToProject1735032814273;
