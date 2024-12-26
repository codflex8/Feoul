"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLatAndLngFacilitiesModel1735115542029 = void 0;
class ChangeLatAndLngFacilitiesModel1735115542029 {
    constructor() {
        this.name = 'ChangeLatAndLngFacilitiesModel1735115542029';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` int NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lng\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lng\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\` DROP COLUMN \`lat\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_facilities\`
            ADD \`lat\` varchar(255) NOT NULL
        `);
    }
}
exports.ChangeLatAndLngFacilitiesModel1735115542029 = ChangeLatAndLngFacilitiesModel1735115542029;
