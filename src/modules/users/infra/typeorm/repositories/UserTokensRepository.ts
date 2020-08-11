import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { Repository, getRepository } from 'typeorm';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UsersTokensRepository implements IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });

        return userToken;
    }

    public async generate(userId: string): Promise<UserToken> {
        const userToken = await this.ormRepository.create({ user_id: userId });
        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UsersTokensRepository;
