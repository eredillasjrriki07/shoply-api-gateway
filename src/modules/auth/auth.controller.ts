import { AuthService } from '@/modules/auth/auth.service';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("login")
    async login(@Body() dto: LoginDTO){
        return await this.authService.login(dto.email, dto.password);
    }
}
