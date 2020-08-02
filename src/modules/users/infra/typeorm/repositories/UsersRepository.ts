import User from '@modules/users/infra/typeorm/entities/User';
import { Repository, getRepository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { id },
        });

        return findAppointment;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { email },
        });

        return findAppointment;
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
}

export default UsersRepository;
