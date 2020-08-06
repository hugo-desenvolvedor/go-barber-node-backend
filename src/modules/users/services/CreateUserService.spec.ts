import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const [name, email, password] = [
            'John Doe',
            'johndoe@example.com',
            '123456',
        ];
        const user = await createUser.execute({ name, email, password });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with repeated email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const [name, email, password] = [
            'John Doe',
            'johndoe@example.com',
            '123456',
        ];
        await createUser.execute({ name, email, password });

        await expect(
            createUser.execute({
                name,
                email,
                password,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
