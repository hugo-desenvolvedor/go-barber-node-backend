import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProfileService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProfileService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        listProviders = new ListProfileService(fakeUsersRepository);
    });

    it('should be able to list the providers', async () => {
        const tom = await fakeUsersRepository.create({
            name: 'Tom',
            email: 'tom@example.com',
            password: '123456',
        });

        const dick = await fakeUsersRepository.create({
            name: 'Dick',
            email: 'dick@example.com',
            password: '123456',
        });

        const harry = await fakeUsersRepository.create({
            name: 'Harry',
            email: 'harry@example.com',
            password: '123456',
        });

        const providers = await listProviders.execute({ userId: harry.id });

        expect(providers).toEqual([tom, dick]);
    });
});
