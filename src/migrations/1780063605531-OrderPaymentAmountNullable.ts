import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderPaymentAmountNullable1780063605531 implements MigrationInterface {
    name = 'OrderPaymentAmountNullable1780063605531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`amount\` \`amount\` decimal(10,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_payment\` CHANGE \`amount\` \`amount\` decimal(10,2) NOT NULL`);
    }

}
