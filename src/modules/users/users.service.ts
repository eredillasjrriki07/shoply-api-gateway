import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    async findById(id: string) {
        return this.userRepo.findOne({ where: { id } });
    }

    async updateLastLogin(id: string) {
        return this.userRepo.update(id, { lastLoginAt: new Date() });
    }
}
