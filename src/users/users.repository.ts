import { Injectable } from '@nestjs/common';

interface UserStorage {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UsersRepository {
    private users: UserStorage[] = [];

    async create(userData: Omit<UserStorage, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserStorage> {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    async findByEmail(email: string): Promise<UserStorage | null> {
        return this.users.find(user => user.email === email) || null;
    }

    async findById(id: string): Promise<UserStorage | null> {
        return this.users.find(user => user.id === id) || null;
    }
}