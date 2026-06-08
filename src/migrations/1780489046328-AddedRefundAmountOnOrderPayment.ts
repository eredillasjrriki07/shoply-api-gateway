import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRefundAmountOnOrderPayment1780489046328 implements MigrationInterface {
    name = 'AddedRefundAmountOnOrderPayment1780489046328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` ADD \`amount_refunded\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`status\` \`status\` enum ('Pending', 'Authorized', 'Paid', 'Failed', 'Refund_pending', 'Refunded') NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`status\` \`status\` enum ('pending', 'authorized', 'paid', 'failed', 'refund_pending', 'refunded') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`order_payment\` DROP COLUMN \`amount_refunded\``);
    }

}
