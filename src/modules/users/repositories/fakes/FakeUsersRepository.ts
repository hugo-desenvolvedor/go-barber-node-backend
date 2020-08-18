import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const foundUser = this.users.find(user => user.id === id);

        return foundUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = this.users.find(user => user.email === email);

        return foundUser;
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, data);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const userId = user.id;

        const foundIndex = this.users.findIndex(user => user.id === userId);

        this.users[foundIndex] = user;

        return user;
    }

    public async findAllProviders(data: IFindAllProvidersDTO): Promise<User[]> {
        const { ignoredUserId } = data;

        if (!ignoredUserId) {
            return this.users;
        }

        return this.users.filter(user => user.id !== ignoredUserId);
    }
}

export default FakeUsersRepository;
