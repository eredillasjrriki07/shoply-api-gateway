import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { CustomersView } from './entities/customers.view';
import { constants } from '@/common/util/constants';
import { UserRole } from '@/common/enums/roles.enum';
import { Logger } from '@nestjs/common';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(CustomersView)
        private readonly customersView: Repository<CustomersView>
    ) { }

    private readonly logger = new Logger(UsersService.name);

    async getAll(userFilterDto: UserFilterDto) {

        const where: FindOptionsWhere<CustomersView> = {};

        if (userFilterDto.email) where.email = userFilterDto.email;

        this.logger.log(`Fetching all users with filter ${JSON.stringify(where)}`);

        const count = await this.customersView.count();

        const users = await this.customersView.find({
            where,
            order: { name: 'asc' },
            skip: (userFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        this.logger.log(`Found ${count} users.`);

        const response = { page: userFilterDto.page, count, users };

        return response;
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            this.logger.log('Creating user...');
            const passwordHash = await bcrypt.hash(createUserDto.password, 12);

            const user = this.userRepo.create({
                email: createUserDto.email,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                role: createUserDto.role,
                isActive: createUserDto.isActive,
                passwordHash,
            });

            const newUser = await this.userRepo.save(user);

            this.logger.log(`Successfully created user with id ${newUser.id}`);

            return newUser;
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException('Unknown error occured.');
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        this.logger.log(`Updateing user with id ${id}`);

        const result = await this.userRepo.update(id, updateUserDto);

        if (result.affected === 0) {
            this.logger.warn(`User with id ${id} not found.`);
            throw new NotFoundException(`User with id ${id} not found.`);
        }

        const updated = await this.userRepo.findOneBy({ id });

        this.logger.log(`Successfully updated user with id ${updated!.id}`);

        return updated;
    }

    async findById(id: string) {
        this.logger.log(`Fetching user with id ${id}`);
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

        if (!user) {
            this.logger.warn(`User with id ${id} not found.`);
            throw new NotFoundException(`User with id ${id} not found.`);
        }

        this.logger.log(`Fetched user with id ${id}`);

        return user;
    }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    async updateLastLogin(id: string) {
        return this.userRepo.update(id, { lastLoginAt: new Date() });
    }

    async getCustomerCount() {
        const customerCount = await this.userRepo.count({
            where: { role: UserRole.CUSTOMER }
        });

        return customerCount;
    }
}
