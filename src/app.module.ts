import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from './modules/users/users.module';
import { User } from "./modules/users/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT"),
        username: config.get<string>("DATABASE_USER"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        entities: [User],
        synchronize: false, // never true in production — use migrations
        charset: "utf8mb4_unicode_ci",
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }