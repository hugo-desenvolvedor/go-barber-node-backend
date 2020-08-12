import User from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        userId,
        name,
        email,
        oldPassword,
        password,
    }: IRequest): Promise<User> {
        if (password && !oldPassword) {
            throw new AppError('The old password is required to update');
        }

        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found');
        }

        if (password && oldPassword) {
            const checkedPassword = await this.hashProvider.compareHash(
                user.password,
                oldPassword,
            );

            if (!checkedPassword) {
                throw new AppError('The credentials are wrong');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        const foundUserEmail = await this.usersRepository.findByEmail(email);
        if (foundUserEmail && foundUserEmail.id !== userId) {
            throw new AppError('This email is already used');
        }

        user.name = name;
        user.email = email;

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
