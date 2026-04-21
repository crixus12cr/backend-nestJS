import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        // Verificar si ya existe por email o username
        const existingUser = await this.usersRepository.findOne({
            where: [{ email: createUserDto.email }, { username: createUserDto.username }],
        });
        if (existingUser) {
            throw new ConflictException('El email o nombre de usuario ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await this.usersRepository.save(newUser);
        const { password, ...result } = savedUser;
        return result;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}