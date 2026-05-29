import { AuthService } from '@/modules/auth/auth.service';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDTO){
        return await this.authService.login(dto.email, dto.password);
    }
}
