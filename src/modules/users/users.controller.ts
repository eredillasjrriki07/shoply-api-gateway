import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(@Query() userFilterDto: UserFilterDto) {
        return await this.userService.getAll(userFilterDto);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id') id: string) {
        return await this.userService.findById(id);
    }

    @Patch('update/:id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(id, updateUserDto);
    }
}
