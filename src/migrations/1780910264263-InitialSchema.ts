import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780910264263 implements MigrationInterface {
    name = 'InitialSchema1780910264263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_color\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NOT NULL, \`value\` varchar(50) NOT NULL, UNIQUE INDEX \`uq_color\` (\`product_id\`, \`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_size\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NOT NULL, \`value\` varchar(20) NOT NULL, UNIQUE INDEX \`uq_size\` (\`product_id\`, \`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`first_name\` varchar(100) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`role\` enum ('ADMIN', 'CUSTOMER') NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`last_login_at\` datetime NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, \`product_id\` varchar(36) NOT NULL, \`order_item_id\` varchar(36) NOT NULL, \`rating\` tinyint UNSIGNED NOT NULL, \`comment\` text NULL, UNIQUE INDEX \`IDX_84702d118919fccfc4b09b4cec\` (\`user_id\`, \`product_id\`), UNIQUE INDEX \`REL_6fb5caf1d99ffc8dab2dcbbcf6\` (\`order_item_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`image_url\` varchar(500) NULL, \`category\` enum ('Apparel', 'Home', 'Tech', 'Outdoor') NOT NULL, \`price\` decimal(10,2) NOT NULL, \`old_price\` decimal(10,2) NULL, \`description\` text NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, INDEX \`idx_products_category\` (\`category\`), INDEX \`idx_products_is_active\` (\`is_active\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_variant\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NOT NULL, \`sku\` varchar(50) NOT NULL, \`size\` varchar(20) NULL, \`color\` varchar(50) NULL, \`price_override\` decimal(10,2) NULL, \`stocks\` int UNSIGNED NOT NULL DEFAULT '0', UNIQUE INDEX \`uq_variant\` (\`product_id\`, \`size\`, \`color\`), UNIQUE INDEX \`uq_variant_sku\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int UNSIGNED NOT NULL, \`variant_id\` varchar(255) NOT NULL, \`product_name\` varchar(255) NOT NULL, \`variant_label\` varchar(36) NULL, \`quantity\` int UNSIGNED NOT NULL, \`unit_price\` decimal(10,2) NOT NULL, \`line_total\` decimal(10,2) AS (quantity * unit_price) STORED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`INSERT INTO \`shoply\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["shoply","order_item","GENERATED_COLUMN","line_total","quantity * unit_price"]);
        await queryRunner.query(`CREATE TABLE \`order_payment\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int UNSIGNED NOT NULL, \`method\` enum ('Card') NOT NULL, \`checkout_session_id\` varchar(100) NULL, \`status\` enum ('Pending', 'Authorized', 'Paid', 'Failed', 'Refund pending', 'Refunded') NOT NULL DEFAULT 'Pending', \`provider_ref\` varchar(36) NULL, \`amount\` decimal(10,2) NULL, \`amount_refunded\` decimal(10,2) NULL, \`paid_at\` datetime NULL, UNIQUE INDEX \`REL_fb74ab8e4ee3d2c6e73c261d8e\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_shipping_address\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int UNSIGNED NOT NULL, \`recipient_name\` varchar(255) NOT NULL, \`phone\` varchar(20) NOT NULL, \`line1\` varchar(255) NOT NULL, \`line2\` varchar(255) NULL, \`city\` varchar(100) NOT NULL, \`postal_code\` varchar(20) NOT NULL, \`country\` varchar(100) NOT NULL, UNIQUE INDEX \`REL_d7b1a73ac16e61fc4f9f445253\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_timeline_event\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int UNSIGNED NOT NULL, \`event_type\` enum ('Placed', 'To ship', 'Cancelled', 'Shipped', 'Delivered', 'Return/Refund') NOT NULL DEFAULT 'Placed', \`note\` text NULL, \`occurred_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` varchar(36) NOT NULL, \`order_number\` varchar(255) NULL, \`status\` enum ('Placed', 'To Ship', 'Cancelled', 'To Receive', 'Completed', 'Return/Refund') NOT NULL DEFAULT 'To Ship', \`subtotal\` decimal(10,2) NOT NULL, \`shipping_fee\` decimal(10,2) NOT NULL, \`tax\` decimal(10,2) NOT NULL, \`promo_id\` varchar(36) NOT NULL, \`total\` decimal(10,2) AS (subtotal + shipping_fee + tax) STORED NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f9180f384353c621e8d0c414c1\` (\`order_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`INSERT INTO \`shoply\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["shoply","order","GENERATED_COLUMN","total","subtotal + shipping_fee + tax"]);
        await queryRunner.query(`CREATE TABLE \`promo\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(20) NOT NULL, \`type\` enum ('Percent off subtotal', 'Fixed amount off', 'Free shipping') NOT NULL, \`value\` varchar(50) NOT NULL, \`label\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_3ff1cb7045502ac76b57a544b0\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_color\` ADD CONSTRAINT \`FK_44afd60e2220b89874a86a11cd9\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_size\` ADD CONSTRAINT \`FK_2c5c35c613e3e028e211821f7b9\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_81446f2ee100305f42645d4d6c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_26b533e15b5f2334c96339a1f08\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_6fb5caf1d99ffc8dab2dcbbcf62\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_item\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_ca67dd080aac5ecf99609960cd2\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_6312e502a3cc8068671253bdbaf\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_e9674a6053adbaa1057848cddfa\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` ADD CONSTRAINT \`FK_fb74ab8e4ee3d2c6e73c261d8e3\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` ADD CONSTRAINT \`FK_d7b1a73ac16e61fc4f9f445253e\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` ADD CONSTRAINT \`FK_4c96c6578b1a4bd04f5b4b8b443\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_bc89c22757486ebc515394e8807\` FOREIGN KEY (\`promo_id\`) REFERENCES \`promo\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_bc89c22757486ebc515394e8807\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_199e32a02ddc0f47cd93181d8fd\``);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` DROP FOREIGN KEY \`FK_4c96c6578b1a4bd04f5b4b8b443\``);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` DROP FOREIGN KEY \`FK_d7b1a73ac16e61fc4f9f445253e\``);
        await queryRunner.query(`ALTER TABLE \`order_payment\` DROP FOREIGN KEY \`FK_fb74ab8e4ee3d2c6e73c261d8e3\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_e9674a6053adbaa1057848cddfa\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_6312e502a3cc8068671253bdbaf\``);
        await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_ca67dd080aac5ecf99609960cd2\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_6fb5caf1d99ffc8dab2dcbbcf62\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_26b533e15b5f2334c96339a1f08\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_81446f2ee100305f42645d4d6c2\``);
        await queryRunner.query(`ALTER TABLE \`product_size\` DROP FOREIGN KEY \`FK_2c5c35c613e3e028e211821f7b9\``);
        await queryRunner.query(`ALTER TABLE \`product_color\` DROP FOREIGN KEY \`FK_44afd60e2220b89874a86a11cd9\``);
        await queryRunner.query(`DROP INDEX \`IDX_3ff1cb7045502ac76b57a544b0\` ON \`promo\``);
        await queryRunner.query(`DROP TABLE \`promo\``);
        await queryRunner.query(`DELETE FROM \`shoply\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","total","shoply","order"]);
        await queryRunner.query(`DROP INDEX \`IDX_f9180f384353c621e8d0c414c1\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`order_timeline_event\``);
        await queryRunner.query(`DROP INDEX \`REL_d7b1a73ac16e61fc4f9f445253\` ON \`order_shipping_address\``);
        await queryRunner.query(`DROP TABLE \`order_shipping_address\``);
        await queryRunner.query(`DROP INDEX \`REL_fb74ab8e4ee3d2c6e73c261d8e\` ON \`order_payment\``);
        await queryRunner.query(`DROP TABLE \`order_payment\``);
        await queryRunner.query(`DELETE FROM \`shoply\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","line_total","shoply","order_item"]);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP INDEX \`uq_variant_sku\` ON \`product_variant\``);
        await queryRunner.query(`DROP INDEX \`uq_variant\` ON \`product_variant\``);
        await queryRunner.query(`DROP TABLE \`product_variant\``);
        await queryRunner.query(`DROP INDEX \`idx_products_is_active\` ON \`product\``);
        await queryRunner.query(`DROP INDEX \`idx_products_category\` ON \`product\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`REL_6fb5caf1d99ffc8dab2dcbbcf6\` ON \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_84702d118919fccfc4b09b4cec\` ON \`review\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`uq_size\` ON \`product_size\``);
        await queryRunner.query(`DROP TABLE \`product_size\``);
        await queryRunner.query(`DROP INDEX \`uq_color\` ON \`product_color\``);
        await queryRunner.query(`DROP TABLE \`product_color\``);
    }

}
