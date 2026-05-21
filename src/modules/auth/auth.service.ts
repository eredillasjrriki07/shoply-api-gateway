import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.passwordHash)))
            throw new UnauthorizedException("Invalid username or password!");

        if (!user.isActive) {
            throw new ForbiddenException("Account disabled!");
        }

        const { passwordHash: _, ...userWithoutPassword } = user;

        const payload = {
            sub: user.id,
            ...userWithoutPassword
        };

        return await this.jwtService.signAsync(payload);
    }

}
