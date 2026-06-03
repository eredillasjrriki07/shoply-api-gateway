import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCheckoutSessionOnOrderPayment1780467843422 implements MigrationInterface {
    name = 'AddedCheckoutSessionOnOrderPayment1780467843422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` ADD \`checkout_session_id\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` DROP COLUMN \`checkout_session_id\``);
    }

}
