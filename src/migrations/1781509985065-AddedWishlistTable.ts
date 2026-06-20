import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWishlistTable1781509985065 implements MigrationInterface {
    name = 'AddedWishlistTable1781509985065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`wishlist_item\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, \`product_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`wishlist_item\` ADD CONSTRAINT \`FK_928fbf35568fcab9681d8270792\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wishlist_item\` DROP FOREIGN KEY \`FK_928fbf35568fcab9681d8270792\``);
        await queryRunner.query(`DROP TABLE \`wishlist_item\``);
    }

}
