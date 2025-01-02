"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDefaultValueForSalesChannels1735725954234 = void 0;
class SetDefaultValueForSalesChannels1735725954234 {
    constructor() {
        this.name = 'SetDefaultValueForSalesChannels1735725954234';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`salesChannels\` \`salesChannels\` text NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`unit\` CHANGE \`salesChannels\` \`salesChannels\` text NOT NULL
        `);
    }
}
exports.SetDefaultValueForSalesChannels1735725954234 = SetDefaultValueForSalesChannels1735725954234;
