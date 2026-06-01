import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReviewsTable1780297012268 implements MigrationInterface {
    name = 'AddedReviewsTable1780297012268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, \`product_id\` varchar(36) NOT NULL, \`order_item_id\` varchar(36) NOT NULL, \`rating\` tinyint UNSIGNED NOT NULL, \`comment\` text NULL, UNIQUE INDEX \`IDX_84702d118919fccfc4b09b4cec\` (\`user_id\`, \`product_id\`), UNIQUE INDEX \`REL_6fb5caf1d99ffc8dab2dcbbcf6\` (\`order_item_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_81446f2ee100305f42645d4d6c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_26b533e15b5f2334c96339a1f08\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_6fb5caf1d99ffc8dab2dcbbcf62\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_item\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_6fb5caf1d99ffc8dab2dcbbcf62\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_26b533e15b5f2334c96339a1f08\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_81446f2ee100305f42645d4d6c2\``);
        await queryRunner.query(`DROP INDEX \`REL_6fb5caf1d99ffc8dab2dcbbcf6\` ON \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_84702d118919fccfc4b09b4cec\` ON \`review\``);
        await queryRunner.query(`DROP TABLE \`review\``);
    }

}
