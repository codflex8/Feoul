"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMapLocationsModel1735140507656 = void 0;
class AddMapLocationsModel1735140507656 {
    constructor() {
        this.name = 'AddMapLocationsModel1735140507656';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`map_locations\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`type\` varchar(255) NOT NULL,
                \`lat\` int NOT NULL,
                \`lng\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`map_locations\`
        `);
    }
}
exports.AddMapLocationsModel1735140507656 = AddMapLocationsModel1735140507656;
