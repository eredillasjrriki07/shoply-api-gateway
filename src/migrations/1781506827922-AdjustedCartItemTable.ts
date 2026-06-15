import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustedCartItemTable1781506827922 implements MigrationInterface {
    name = 'AdjustedCartItemTable1781506827922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_b616e11e081d5f5508398825485\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_b616e11e081d5f5508398825485\``);
    }

}
