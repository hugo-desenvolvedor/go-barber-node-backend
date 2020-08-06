import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

let name: string;
let email: string;
let password: string;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
        );

        [name, email, password] = ['John Doe', 'johndoe@example.com', '123456'];
    });

    it('should be able to reset the password', async () => {
        const NEW_PASSWORD = '654321';

        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const updatedUser = await fakeUsersRepository.findById(user.id);

        await resetPassword.execute({ password: NEW_PASSWORD, token });

        expect(updatedUser?.password).toBe(NEW_PASSWORD);
    });
});
