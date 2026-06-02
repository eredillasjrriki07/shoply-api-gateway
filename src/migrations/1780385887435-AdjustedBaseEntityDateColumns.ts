import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustedBaseEntityDateColumns1780385887435 implements MigrationInterface {
    name = 'AdjustedBaseEntityDateColumns1780385887435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_color\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_color\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_size\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_size\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`created_at\` \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`updated_at\` \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_timeline_event\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_shipping_address\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_variant\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_size\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_size\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_color\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);
        await queryRunner.query(`ALTER TABLE \`product_color\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)`);
    }

}
