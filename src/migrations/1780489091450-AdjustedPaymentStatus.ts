import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustedPaymentStatus1780489091450 implements MigrationInterface {
    name = 'AdjustedPaymentStatus1780489091450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`status\` \`status\` enum ('Pending', 'Authorized', 'Paid', 'Failed', 'Refund pending', 'Refunded') NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`status\` \`status\` enum ('Pending', 'Authorized', 'Paid', 'Failed', 'Refund_pending', 'Refunded') NOT NULL DEFAULT 'Pending'`);
    }

}
