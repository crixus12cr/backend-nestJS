import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersRepository.findById(id);
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}