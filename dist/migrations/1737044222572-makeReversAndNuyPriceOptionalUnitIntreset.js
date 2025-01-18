"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeReversAndNuyPriceOptionalUnitIntreset1737044222572 = void 0;
class MakeReversAndNuyPriceOptionalUnitIntreset1737044222572 {
    constructor() {
        this.name = 'MakeReversAndNuyPriceOptionalUnitIntreset1737044222572';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`reversePrice\` \`reversePrice\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`buyPrice\` \`buyPrice\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`buyPrice\` \`buyPrice\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`unit_intreset\` CHANGE \`reversePrice\` \`reversePrice\` int NOT NULL
        `);
    }
}
exports.MakeReversAndNuyPriceOptionalUnitIntreset1737044222572 = MakeReversAndNuyPriceOptionalUnitIntreset1737044222572;
