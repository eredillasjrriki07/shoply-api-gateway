import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { CustomersView } from './entities/customers.view';
import { constants } from '@/common/util/constants';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(CustomersView)
        private readonly customersView: Repository<CustomersView>
    ) { }

    async getAll(userFilterDto: UserFilterDto) {

        const where: FindOptionsWhere<CustomersView> = {};

        if (userFilterDto.email) where.email = userFilterDto.email;

        const count = await this.customersView.count();

        const users = await this.customersView.find({
            where,
            order: { name: 'asc' },
            skip: (userFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        const response = { page: userFilterDto.page, count, users };

        return response;
    }

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
            relations: {
                orders: true,
                reviews: true
            },
            order: {
                orders: { createdAt: 'desc' },
                reviews: { createdAt: 'desc' },
            },
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
