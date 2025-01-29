"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNumberInUnitCategory1737976369198 = void 0;
class RemoveNumberInUnitCategory1737976369198 {
    constructor() {
        this.name = "RemoveNumberInUnitCategory1737976369198";
    }
    async up(queryRunner) {
        // await queryRunner.query(`
        //         ALTER TABLE \`unit_categories\` DROP COLUMN \`number\`
        //     `);
    }
    async down(queryRunner) {
        // await queryRunner.query(`
        //         ALTER TABLE \`unit_categories\`
        //         ADD \`number\` int NOT NULL
        //     `);
    }
}
exports.RemoveNumberInUnitCategory1737976369198 = RemoveNumberInUnitCategory1737976369198;
