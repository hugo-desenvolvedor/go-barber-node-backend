import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
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

        const response = await authenticateUser.execute({ email, password });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const [email, password] = ['John Doe', 'johndoe@example.com', '123456'];

        await expect(
            authenticateUser.execute({ email, password }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate incorrect values', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const [name, email, password] = [
            'John Doe',
            'johndoe@example.com',
            '123456',
        ];
        const wrongEmail = 'janedoe@example.com';
        const wrongPassword = '654321';

        await createUser.execute({ name, email, password });

        await expect(
            authenticateUser.execute({ email: wrongEmail, password }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            authenticateUser.execute({ email, password: wrongPassword }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
