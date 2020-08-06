import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

let name: string;
let email: string;
let password: string;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );

        [name, email, password] = ['John Doe', 'johndoe@example.com', '123456'];
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name,
            email,
            password,
        });

        await sendForgotPasswordEmail.execute({ email });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({ email }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepository.create({
            name,
            email,
            password,
        });

        await sendForgotPasswordEmail.execute({ email });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
