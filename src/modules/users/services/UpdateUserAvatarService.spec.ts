import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;
let name: string;
let email: string;
let password: string;
let avatarFileName: string;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        name = 'John Doe';
        email = 'johndoe@example.com';
        password = '123456';
        avatarFileName = 'avatar.jpg';
    });

    it('should be able to update user avatar', async () => {
        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName,
        });

        expect(user.avatar).toBe(avatarFileName);
    });

    it('should not be able to update user avatar when the user id not exists', async () => {
        await expect(
            updateUserAvatar.execute({
                userId: 'non-existing-user',
                avatarFileName,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const newAvatarFileName = 'avatar2.jpg';

        const user = await fakeUsersRepository.create({
            name,
            email,
            password,
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName,
        });

        await updateUserAvatar.execute({
            userId: user.id,
            avatarFileName: newAvatarFileName,
        });

        expect(deleteFile).toHaveBeenCalledWith(avatarFileName);
        expect(user.avatar).toBe(newAvatarFileName);
    });
});
