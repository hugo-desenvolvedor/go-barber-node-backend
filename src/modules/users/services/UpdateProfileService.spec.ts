import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;
let name: string;
let email: string;
let password: string;
let newName: string;
let newEmail: string;
let newPassword: string;
let wrongPassword: string;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        name = 'John Doe';
        email = 'johndoe@example.com';
        password = '123456';

        newName = 'Jane Doe';
        newEmail = 'janedoe@example.com';
        newPassword = '123123';
        wrongPassword = 'abcabc';
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        const updatedUser = await updateProfile.execute({
            userId: user.id,
            name: newName,
            email: newEmail,
        });

        expect(updatedUser.name).toBe(newName);
        expect(updatedUser.email).toBe(newEmail);
    });

    it('should be able to update the profile to email that already exists', async () => {
        await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        const user = await fakeUsersRepository.create({
            name: newName,
            email: newEmail,
            password,
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name,
                email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update password', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        const updatedUser = await updateProfile.execute({
            userId: user.id,
            name,
            email,
            oldPassword: password,
            password: newPassword,
        });

        expect(updatedUser.password).toBe(newPassword);
    });

    it('should not be able to update password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name,
                email,
                password: newPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        await expect(
            updateProfile.execute({
                userId: user.id,
                name,
                email,
                oldPassword: wrongPassword,
                password: newPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile from not-existing user', async () => {
        await expect(
            updateProfile.execute({
                userId: 'non-existing-user',
                name,
                email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
