import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    private readonly logger = new Logger(AuthService.name);

    async login(email: string, password: string) {
        this.logger.log(`Logging in user with email ${email}`);
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            this.logger.warn(`Login failed!`);
            throw new UnauthorizedException("Invalid username or password!");
        }

        if (!user.isActive) {
            this.logger.warn(`Account disabled!`);
            throw new ForbiddenException("Account disabled!");
        }

        const { passwordHash: _, ...userWithoutPassword } = user;

        const payload = {
            sub: user.id,
            ...userWithoutPassword
        };

        await this.usersService.updateLastLogin(user.id);

        this.logger.log(`Successfully logged in user! Email: ${email}`);

        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }

}
