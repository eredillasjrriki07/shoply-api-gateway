import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const passwordHash = await bcrypt.hash(createUserDto.password, 12);

        const user = this.userRepo.create({
            email: createUserDto.email,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            role: createUserDto.role,
            isActive: createUserDto.isActive,
            passwordHash,
        });

        return this.userRepo.save(user);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const result = await this.userRepo.update(id, updateUserDto);

        if (result.affected === 0) throw new NotFoundException(`User with id ${id} not found.`);

        return this.userRepo.findOneBy({ id });
    }

    async findById(id: string) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: { orders: true, reviews: true }
        });

        if (!user) throw new NotFoundException(`User with id ${id} not found.`);

        return user;
    }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    async updateLastLogin(id: string) {
        return this.userRepo.update(id, { lastLoginAt: new Date() });
    }
}
