import User from '@modules/users/infra/typeorm/entities/User';
import { Repository, getRepository, Not } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne({
            where: { id },
        });

        return foundUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne({
            where: { email },
        });

        return foundUser;
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(data);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        await this.ormRepository.save(user);

        return user;
    }

    public async findAllProviders(data: IFindAllProvidersDTO): Promise<User[]> {
        const { ignoredUserId } = data;

        if (!ignoredUserId) {
            return this.ormRepository.find();
        }

        return this.ormRepository.find({
            where: { id: Not(ignoredUserId) },
        });
    }
}

export default UsersRepository;
