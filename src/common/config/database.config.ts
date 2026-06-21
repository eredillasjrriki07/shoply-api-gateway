import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
    type: "mysql",
    host: config.get<string>("DATABASE_HOST"),
    port: config.get<number>("DATABASE_PORT"),
    username: config.get<string>("DATABASE_USER"),
    password: config.get<string>("DATABASE_PASSWORD"),
    database: config.get<string>("DATABASE_NAME"),
    entities: [__dirname + '/../../modules/**/*.{entity,view}{.ts,.js}'],
    synchronize: false, // never true in production — use migrations
    charset: "utf8mb4_unicode_ci",
});