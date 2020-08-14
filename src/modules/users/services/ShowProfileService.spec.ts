import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
let name: string;
let email: string;
let password: string;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);

        name = 'John Doe';
        email = 'johndoe@example.com';
        password = '123456';
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        const profile = await showProfile.execute({ userId: user.id });

        expect(profile.name).toBe(name);
        expect(profile.email).toBe(email);
    });

    it('should not be able to show the profile from not-existing user', async () => {
        await expect(
            showProfile.execute({
                userId: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
